import { cookies } from 'next/headers';
import { refreshSchema } from '@/lib/validators';
import { signAccessToken, verifyToken } from '@/lib/auth';
import { fail, ok, parseBody, withError } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export const POST = withError(async (request) => {
  const cookieStore = await cookies();
  let refreshToken =
    cookieStore.get('carezoon_refresh')?.value ||
    (await parseBody(request, refreshSchema)).refreshToken;

  if (!refreshToken) return fail('Missing refresh token.', 401);

  const payload = await verifyToken(refreshToken);
  if (!payload || payload.type !== 'refresh') return fail('Invalid refresh token.', 401);

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.active) return fail('Invalid refresh token.', 401);

  const accessToken = await signAccessToken(user);
  cookieStore.set({
    name: 'carezoon_access',
    value: accessToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 15 * 60,
  });

  return ok({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
  });
});
