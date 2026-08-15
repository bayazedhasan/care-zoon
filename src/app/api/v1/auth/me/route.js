import { hashPassword } from '@/lib/auth';
import { fail, ok, requireUser, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  const user = await requireUser(request);
  return ok({ user });
});

export const PATCH = withError(async (request) => {
  const user = await requireUser(request);
  const body = await request.json().catch(() => ({}));

  const data = {};
  if (body.name) data.name = body.name;
  if (body.password) data.password = await hashPassword(body.password);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: { id: true, name: true, email: true, role: true },
  });

  return ok({ user: updated });
});
