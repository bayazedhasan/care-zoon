import { ok, requireUser, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { extractToken, verifySupabaseToken } from '@/lib/supabase-auth';

async function syncUser(token) {
  const payload = await verifySupabaseToken(token);
  if (!payload?.sub) return null;

  const { data } = await supabaseAdmin.auth.admin.getUserById(payload.sub);
  if (!data?.user) return null;

  const name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';

  const user = await prisma.user.upsert({
    where: { id: payload.sub },
    update: {},
    create: {
      id: payload.sub,
      email: payload.email,
      name,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
}

export const GET = withError(async (request) => {
  try {
    const user = await requireUser(request);
    return ok({ user });
  } catch {
    const token = extractToken(request);
    if (!token) throw { __unauthorized: true };
    const payload = await verifySupabaseToken(token);
    if (!payload?.sub) throw { __unauthorized: true };
    const synced = await syncUser(token);
    if (!synced) throw new Error('Failed to sync user');
    return ok({ user: synced });
  }
});

export const PATCH = withError(async (request) => {
  const user = await requireUser(request);
  const body = await request.json().catch(() => ({}));

  if (!body.name) return ok({ user });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: body.name },
    select: { id: true, name: true, email: true, role: true },
  });

  return ok({ user: updated });
});
