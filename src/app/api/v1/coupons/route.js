import { couponSchema } from '@/lib/validators';
import {
  fail,
  logActivity,
  notFound,
  ok,
  parseBody,
  requirePermission,
  withError,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const GET = withError(async (request) => {
  await requirePermission(request, 'marketing');
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const q = searchParams.get('q');

  const where = {};
  if (active === '1') where.active = true;
  if (active === '0') where.active = false;
  if (q) where.code = { contains: q, mode: 'insensitive' };

  const coupons = await prisma.coupon.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return ok({ coupons });
});

export const POST = withError(async (request) => {
  const user = await requirePermission(request, 'marketing', 'create');
  const data = await parseBody(request, couponSchema);

  const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (existing) return fail('Coupon code already exists', 409);

  const coupon = await prisma.coupon.create({
    data: {
      code: data.code,
      type: data.type,
      value: Number(data.value),
      minSpend: data.minSpend != null ? Number(data.minSpend) : null,
      usageLimit: data.usageLimit ?? null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      active: data.active,
    },
  });

  await logActivity({ userId: user.id, action: 'create', module: 'marketing', targetId: coupon.id });
  return ok({ coupon }, 201);
});

export const PATCH = withError(async (request) => {
  const user = await requirePermission(request, 'marketing', 'edit');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return notFound();

  const data = await parseBody(request, couponSchema);
  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      code: data.code,
      type: data.type,
      value: Number(data.value),
      minSpend: data.minSpend != null ? Number(data.minSpend) : null,
      usageLimit: data.usageLimit ?? null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      active: data.active,
    },
  });

  await logActivity({ userId: user.id, action: 'edit', module: 'marketing', targetId: id });
  return ok({ coupon });
});

export const DELETE = withError(async (request) => {
  const user = await requirePermission(request, 'marketing', 'delete');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return notFound();

  await prisma.coupon.delete({ where: { id } });
  await logActivity({ userId: user.id, action: 'delete', module: 'marketing', targetId: id });
  return ok({ message: 'Coupon deleted' });
});
