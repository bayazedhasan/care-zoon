import { requirePermission, ok, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

const pad = (n) => String(n).padStart(2, '0');

function dateKey(d, granularity) {
  if (granularity === 'month') return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  if (granularity === 'year') return `${d.getFullYear()}`;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildSeries(orders, granularity) {
  const map = {};
  for (const o of orders) {
    const key = dateKey(o.createdAt, granularity);
    map[key] = map[key] || { label: key, orders: 0, revenue: 0 };
    map[key].orders += 1;
    map[key].revenue += Number(o.total);
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

export const GET = withError(async (request) => {
  await requirePermission(request, 'dashboard');
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';

  const now = new Date();
  let from = new Date();
  let granularity = 'day';
  if (period === '7d') from = new Date(now.getTime() - 7 * 864e5);
  else if (period === '90d') from = new Date(now.getTime() - 90 * 864e5);
  else if (period === '12m') {
    from = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    granularity = 'month';
  } else if (period === 'all') {
    from = new Date(0);
    granularity = 'month';
  } else {
    from = new Date(now.getTime() - 30 * 864e5);
  }

  const [revenueAgg, orderCount, customerCount, productCount, orders, statusBreakdown, recentOrders, recentCustomers, lowStock, topProducts] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: { in: ['PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'] }, status: { not: 'CANCELLED' } },
      }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true, total: true } }),
      prisma.order.groupBy({ by: ['status'], _count: true }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          customer: { select: { name: true, email: true } },
          items: { select: { productName: true, quantity: true } },
        },
      }),
      prisma.customer.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, createdAt: true } }),
      prisma.$queryRaw`
        SELECT id, name, sku, stock, "lowStockThreshold" FROM "Product"
        WHERE status = 'ACTIVE' AND stock <= "lowStockThreshold"
        ORDER BY stock ASC LIMIT 10
      `,
      prisma.orderItem.groupBy({
        by: ['productName'],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 8,
      }),
    ]);

  const statusColors = {
    PENDING: 'amber',
    PROCESSING: 'blue',
    SHIPPED: 'indigo',
    DELIVERED: 'green',
    CANCELLED: 'red',
    REFUNDED: 'gray',
  };

  return ok({
    summary: {
      totalRevenue: revenueAgg._sum.total ?? 0,
      totalOrders: orderCount,
      totalCustomers: customerCount,
      totalProducts: productCount,
    },
    salesSeries: buildSeries(orders, granularity),
    statusBreakdown: statusBreakdown.map((s) => ({ status: s.status, count: s._count, color: statusColors[s.status] })),
    recentOrders,
    recentCustomers,
    lowStock,
    topProducts: topProducts.map((p) => ({ ...p, total: p._sum.total, quantity: p._sum.quantity })),
    period,
  });
});
