import { reviewModerationSchema } from '@/lib/validators';
import { logActivity, notFound, ok, parseBody, requirePermission, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request, { params }) => {
  await requirePermission(request, 'reviews');
  const { id } = await params;
  const review = await prisma.review.findUnique({
    where: { id },
    include: { product: { select: { id: true, name: true } } },
  });
  if (!review) return notFound('Review not found');
  return ok({ review });
});

export const PATCH = withError(async (request, { params }) => {
  const user = await requirePermission(request, 'reviews', 'edit');
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return notFound('Review not found');

  const data = await parseBody(request, reviewModerationSchema);

  const updated = await prisma.review.update({
    where: { id },
    data: {
      status: data.status,
      reply: data.reply ?? undefined,
    },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: { reviewCount: { increment: data.status === 'APPROVED' && review.status !== 'APPROVED' ? 1 : 0 } },
  });

  await logActivity({
    userId: user.id,
    action: `review:${data.status}`,
    module: 'reviews',
    targetId: id,
  });

  return ok({ review: updated });
});

export const DELETE = withError(async (request, { params }) => {
  const user = await requirePermission(request, 'reviews', 'delete');
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return notFound('Review not found');

  await prisma.review.delete({ where: { id } });
  await logActivity({ userId: user.id, action: 'delete', module: 'reviews', targetId: id });
  return ok({ message: 'Review deleted' });
});
