import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

export function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'change-me-to-a-long-random-string') {
    throw new Error('JWT_SECRET is not configured. Set it in your .env file.');
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

async function sign(payload, expiresIn) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function signAccessToken(user) {
  return sign({ sub: user.id, role: user.role, type: 'access' }, ACCESS_EXPIRES);
}

export async function signRefreshToken(user) {
  return sign({ sub: user.id, role: user.role, type: 'refresh' }, REFRESH_EXPIRES);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export function accessTokenCookie(value) {
  return {
    name: 'carezoon_access',
    value,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 15 * 60,
  };
}

export function refreshTokenCookie(value) {
  return {
    name: 'carezoon_refresh',
    value,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  };
}
