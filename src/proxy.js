import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const accessToken = request.cookies.get('carezoon_access')?.value;
    if (!accessToken) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/admin/login')) {
    const accessToken = request.cookies.get('carezoon_access')?.value;
    if (accessToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
