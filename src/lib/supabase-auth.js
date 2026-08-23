import { createRemoteJWKSet, jwtVerify } from 'jose';

// Supabase publishes its signing keys at SUPABASE_JWKS_URL. Tokens are signed
// asymmetrically (ES256), so no shared secret is needed on our side.
let jwks;

function getJwks() {
  if (!jwks) {
    const jwksUrl = process.env.SUPABASE_JWKS_URL;
    if (!jwksUrl) throw new Error('SUPABASE_JWKS_URL is not configured');
    jwks = createRemoteJWKSet(new URL(jwksUrl));
  }
  return jwks;
}

// Verifies a Supabase access token and returns its payload ({ sub, email, role })
// or null if invalid/expired.
export async function verifySupabaseToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
      audience: 'authenticated',
    });
    return payload;
  } catch {
    return null;
  }
}

export function extractToken(request) {
  const header = request.headers.get('authorization');
  return header?.replace(/^Bearer\s+/i, '') || null;
}
