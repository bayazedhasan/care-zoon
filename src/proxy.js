import { NextResponse } from 'next/server';

// Auth is handled by Supabase (client-side session) + the AdminShell client
// guard, so there is nothing to check at the edge anymore. Kept as a
// pass-through matcher placeholder.
export function proxy(request) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
