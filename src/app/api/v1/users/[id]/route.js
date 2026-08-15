import { z } from 'zod';
import { hashPassword } from '@/lib/auth';
import { fail, logActivity, notFound, ok, requireRole, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(6).max(128).optional(),
});

export const PATCH = withError(async (request, { params }) => {
  const admin = await requireRole(request, ['ADMIN']);
  const { id } = await params;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return notFound('User not found');

  const body = await request.json().catch(() => ({}));
  const data = updateSchema.parse(body);

  const { password, ...rest } = data;

  if (id === admin.id && data.active === false) {
    return fail('You cannot deactivate your own account', 400);
  }
  if (id === admin.id && data.role && data.role !== 'ADMIN') {
    return fail('You cannot demote your own account', 400);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      password: password ? await hashPassword(password) : undefined,
    },
    select: { id: true, name: true, email: true, role: true, active: true },
  });

  await logActivity({ userId: admin.id, action: 'edit', module: 'users', targetId: id });
  return ok({ user: updated });
});

export const DELETE = withError(async (request, { params }) => {
  const admin = await requireRole(request, ['ADMIN']);
  const { id } = await params;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return notFound('User not found');
  if (target.id === admin.id) return fail('Cannot delete your own account', 400);

  await prisma.user.delete({ where: { id } });
  await logActivity({ userId: admin.id, action: 'delete', module: 'users', targetId: id });
  return ok({ message: 'User deleted' });
});
