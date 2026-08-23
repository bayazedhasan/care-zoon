import { registerSchema } from '@/lib/validators';
import {
  fail,
  getPagination,
  logActivity,
  ok,
  parseBody,
  requirePermission,
  requireRole,
  withError,
  withPagination,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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

  const email = data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return fail('A user with this email already exists', 409);

  // Credentials live in Supabase Auth; we only mirror the profile into Prisma.
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: data.password,
    user_metadata: { name: data.name },
    email_confirm: true,
  });
  if (authError || !authData?.user) {
    return fail(authError?.message || 'Failed to create auth user', 400);
  }

  try {
    const created = await prisma.user.create({
      data: {
        id: authData.user.id,
        name: data.name,
        email,
        role: 'STAFF',
      },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });

    await logActivity({ userId: user.id, action: 'create', module: 'users', targetId: created.id });
    return ok({ user: created }, 201);
  } catch (err) {
    // Roll back the auth user if the Prisma insert fails.
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw err;
  }
});
