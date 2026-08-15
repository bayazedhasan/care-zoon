import { getPagination, ok, requirePermission, withError, withPagination } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'orders');
  const { searchParams } = new URL(request.url);
  const { page, limit, skip, sort, order } = getPagination(searchParams);

  const where = {};

  const status = searchParams.get('status');
  if (status && status !== 'ALL') where.status = status;

  const paymentStatus = searchParams.get('paymentStatus');
  if (paymentStatus && paymentStatus !== 'ALL') where.paymentStatus = paymentStatus;

  const q = searchParams.get('q');
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { customer: { is: { name: { contains: q, mode: 'insensitive' } } } },
    ];
  }

  const customerId = searchParams.get('customerId');
  if (customerId) where.customerId = customerId;

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(`${to}T23:59:59.999Z`);
  }

  const sortMap = { createdAt: 'createdAt', total: 'total', status: 'status' };
  const orderBy = { [sortMap[sort] || 'createdAt']: order };

  const [total, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: { select: { id: true, productName: true, sku: true, image: true, quantity: true, unitPrice: true, total: true, variant: true } },
        _count: { select: { items: true } },
      },
    }),
  ]);

  return ok(withPagination(total, items, page, limit));
});
