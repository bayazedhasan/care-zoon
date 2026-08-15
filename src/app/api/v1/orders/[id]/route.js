import { orderStatusSchema } from '@/lib/validators';
import { logActivity, notFound, ok, parseBody, requirePermission, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

async function findOrder(id) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true, totalSpent: true } },
      items: { include: { product: { select: { id: true, name: true, slug: true, images: true } } } },
      transactions: { orderBy: { createdAt: 'desc' } },
      timeline: { orderBy: { createdAt: 'desc' } },
      returnRequests: { orderBy: { createdAt: 'desc' } },
    },
  });
}

export const GET = withError(async (request, { params }) => {
  await requirePermission(request, 'orders');
  const { id } = await params;
  const order = await findOrder(id);
  if (!order) return notFound('Order not found');
  return ok({ order });
});

export const PATCH = withError(async (request, { params }) => {
  const user = await requirePermission(request, 'orders', 'edit');
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return notFound('Order not found');

  const data = await parseBody(request, orderStatusSchema);

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: data.status,
      trackingNumber: data.trackingNumber ?? order.trackingNumber,
    },
  });

  await prisma.orderTimeline.create({
    data: {
      orderId: id,
      status: data.status,
      note: data.note || `Status changed to ${data.status}`,
      userId: user.id,
    },
  });

  await logActivity({
    userId: user.id,
    action: `order:${data.status}`,
    module: 'orders',
    targetId: id,
    details: { note: data.note || null },
  });

  const fresh = await findOrder(id);
  return ok({ order: fresh });
});

export const DELETE = withError(async (request, { params }) => {
  await requirePermission(request, 'orders', 'delete');
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return notFound('Order not found');

  await prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } });
  await prisma.orderTimeline.create({
    data: { orderId: id, status: 'CANCELLED', note: 'Order cancelled by admin' },
  });

  return ok({ message: 'Order cancelled' });
});
