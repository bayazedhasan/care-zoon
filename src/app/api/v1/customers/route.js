import { getPagination, ok, requirePermission, withError, withPagination } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'customers');
  const { searchParams } = new URL(request.url);
  const { page, limit, skip, sort, order } = getPagination(searchParams);

  const where = {};

  const q = searchParams.get('q');
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
    ];
  }

  const status = searchParams.get('status');
  if (status) where.status = status;

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(`${to}T23:59:59.999Z`);
  }

  const sortMap = { createdAt: 'createdAt', name: 'name', totalSpent: 'totalSpent', ordersCount: 'ordersCount' };
  const orderBy = { [sortMap[sort] || 'createdAt']: order };

  const [total, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({ where, orderBy, skip, take: limit }),
  ]);

  return ok(withPagination(total, customers, page, limit));
});
