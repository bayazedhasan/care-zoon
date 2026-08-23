import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { extractToken, verifySupabaseToken } from './supabase-auth';
import { hasPermission } from './permissions';
import { prisma } from './prisma';

export function ok(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message, status = 400, details = undefined) {
  return NextResponse.json({ success: false, error: { message, details } }, { status });
}

export function notFound(message = 'Resource not found') {
  return fail(message, 404);
}

export function unauthorized(message = 'Unauthorized') {
  return fail(message, 401);
}

export function forbidden(message = 'Forbidden') {
  return fail(message, 403);
}

export function handleApiError(error) {
  console.error('[api-error]', error);

  if (error instanceof ZodError) {
    return fail('Validation failed', 422, error.flatten());
  }

  if (error?.code === 'P2002') {
    return fail('A record with this value already exists', 409, {
      target: error.meta?.target,
    });
  }

  if (error?.code === 'P2025') {
    return notFound();
  }

  return fail('Internal server error', 500);
}

export async function parseBody(request, schema) {
  const body = await request.json().catch(() => ({}));
  const result = schema.safeParse(body);
  if (!result.success) throw new ZodError(result.error.issues);
  return result.data;
}

export async function getCurrentUser(request) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifySupabaseToken(token);
  // payload.sub is the Supabase auth.users UUID, which is our User.id
  if (!payload?.sub) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  if (!user || !user.active) return null;
  return user;
}

export async function requireUser(request) {
  const user = await getCurrentUser(request);
  if (!user) throw { __unauthorized: true };
  return user;
}

export async function requireRole(request, roles) {
  const user = await requireUser(request);
  if (!roles.includes(user.role)) throw { __forbidden: true };
  return user;
}

export async function requirePermission(request, module, permission = 'view') {
  const user = await requireUser(request);
  if (!hasPermission(user.role, module, permission)) throw { __forbidden: true };
  return user;
}

export function withError(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error?.__unauthorized) return unauthorized();
      if (error?.__forbidden) return forbidden();
      return handleApiError(error);
    }
  };
}

export async function logActivity({ userId, action, module, targetId, details, ip }) {
  try {
    await prisma.activityLog.create({
      data: { userId, action, module, targetId, details, ip },
    });
  } catch (err) {
    console.error('[activity-log]', err);
  }
}

export function getPagination(searchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order')?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { page, limit, skip: (page - 1) * limit, sort, order };
}

export function withPagination(total, items, page, limit) {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CZ-${ymd}-${rand}`;
}

const inMemoryRateLimit = new Map();

export async function rateLimit(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const entry = inMemoryRateLimit.get(key);
  if (!entry || entry.resetAt <= now) {
    inMemoryRateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}
