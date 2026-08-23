import { fail, ok, withError } from '@/lib/api';
import { extractToken, verifySupabaseToken } from '@/lib/supabase-auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Called right after supabase.auth.signUp() to mirror the auth user into
// our Prisma User table. Verifies the raw JWT because the Prisma User row
// does not exist yet at this point.
export const POST = withError(async (request) => {
  const payload = await verifySupabaseToken(extractToken(request));
  if (!payload?.sub) return fail('Unauthorized', 401);

  // Prefer fresh values from Supabase Auth over client-sent body.
  let name = null;
  try {
    const body = await request.json();
    name = body?.name || null;
  } catch {
    // no body — fine
  }

  if (!name) {
    const { data } = await supabaseAdmin.auth.admin.getUserById(payload.sub);
    name = data?.user?.user_metadata?.name || data?.user?.email?.split('@')[0] || 'User';
  }

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

  return ok({ user });
});
