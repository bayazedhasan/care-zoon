import { registerSchema } from '@/lib/validators';
import { hashPassword } from '@/lib/auth';
import {
  fail,
  getPagination,
  logActivity,
  notFound,
  ok,
  parseBody,
  requirePermission,
  requireRole,
  withError,
  withPagination,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'users');
  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams);

  const where = {};
  const q = searchParams.get('q');
  if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }];

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true, createdAt: true },
    }),
  ]);

  return ok(withPagination(total, users, page, limit));
});

export const POST = withError(async (request) => {
  const user = await requireRole(request, ['ADMIN']);
  const data = await parseBody(request, registerSchema);

  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) return fail('A user with this email already exists', 409);

  const created = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      password: await hashPassword(data.password),
      role: 'STAFF',
    },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });

  await logActivity({ userId: user.id, action: 'create', module: 'users', targetId: created.id });
  return ok({ user: created }, 201);
});
