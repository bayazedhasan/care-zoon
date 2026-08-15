import { customerUpdateSchema } from '@/lib/validators';
import {
  logActivity,
  notFound,
  ok,
  parseBody,
  requirePermission,
  withError,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';

async function findCustomer(id) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: { items: { select: { productName: true, quantity: true, total: true, image: true } } },
      },
      reviews: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
}

export const GET = withError(async (request, { params }) => {
  await requirePermission(request, 'customers');
  const { id } = await params;
  const customer = await findCustomer(id);
  if (!customer) return notFound('Customer not found');
  return ok({ customer });
});

export const PATCH = withError(async (request, { params }) => {
  const user = await requirePermission(request, 'customers', 'edit');
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) return notFound('Customer not found');

  const data = await parseBody(request, customerUpdateSchema);

  const updated = await prisma.customer.update({
    where: { id },
    data: {
      name: data.name ?? undefined,
      phone: data.phone ?? undefined,
      status: data.status ?? undefined,
      notes: data.notes ?? undefined,
      tags: data.tags ?? undefined,
    },
  });

  await logActivity({
    userId: user.id,
    action: data.status === 'blocked' ? 'block' : 'edit',
    module: 'customers',
    targetId: id,
  });

  return ok({ customer: updated });
});
