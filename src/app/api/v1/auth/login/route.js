import { cookies } from 'next/headers';
import { loginSchema } from '@/lib/validators';
import { hashPassword, signAccessToken, signRefreshToken, verifyPassword } from '@/lib/auth';
import { fail, ok, parseBody, rateLimit, logActivity, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const POST = withError(async (request) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const rl = await rateLimit(`login:${ip}`, 10, 60000);
  if (!rl.ok) {
    return fail('Too many login attempts. Try again later.', 429);
  }

  const data = await parseBody(request, loginSchema);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

  if (!user || !(await verifyPassword(data.password, user.password))) {
    return fail('Invalid email or password.', 401);
  }
  if (!user.active) {
    return fail('This account has been disabled.', 403);
  }

  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await logActivity({
    userId: user.id,
    action: 'login',
    module: 'auth',
    ip,
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: 'carezoon_access',
    value: accessToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 15 * 60,
  });
  cookieStore.set({
    name: 'carezoon_refresh',
    value: refreshToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return ok({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
});
