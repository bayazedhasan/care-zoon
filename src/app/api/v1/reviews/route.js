import { reviewModerationSchema } from '@/lib/validators';
import { getPagination, ok, requirePermission, withError, withPagination } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'reviews');
  const { searchParams } = new URL(request.url);
  const { page, limit, skip, sort, order } = getPagination(searchParams);

  const where = {};
  const status = searchParams.get('status');
  if (status) where.status = status;
  const productId = searchParams.get('productId');
  if (productId) where.productId = productId;
  const reported = searchParams.get('reported');
  if (reported === '1') where.reported = true;

  const q = searchParams.get('q');
  if (q) {
    where.OR = [{ author: { contains: q, mode: 'insensitive' } }, { comment: { contains: q, mode: 'insensitive' } }];
  }

  const orderBy = { [['rating', 'createdAt', 'helpfulCount'].includes(sort) ? sort : 'createdAt']: order };

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        product: { select: { id: true, name: true, image: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  return ok(withPagination(total, reviews, page, limit));
});
