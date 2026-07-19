import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Dashboard protection
  if (pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      if (pathname === '/dashboard') {
        if (role === 'administrator') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        if (role === 'publisher') return NextResponse.redirect(new URL('/dashboard/publisher', request.url));
        if (role === 'service_staff') return NextResponse.redirect(new URL('/dashboard/staff', request.url));
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch { return NextResponse.redirect(new URL('/login', request.url)); }
  }

  // Settings protection — only admin, publisher, staff
  if (pathname.startsWith('/settings')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      if (role === 'public_user') return NextResponse.redirect(new URL('/', request.url));
    } catch { return NextResponse.redirect(new URL('/login', request.url)); }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings'],
};