import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, isValidSessionToken } from './lib/auth';

// Chặn trang quản trị và các API quản trị khi chưa đăng nhập
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Trang đăng nhập luôn mở
  if (pathname === '/cms/login') return NextResponse.next();

  // Khách gửi form đăng ký (POST /api/leads) là công khai; xem danh sách thì phải đăng nhập
  if (pathname === '/api/leads' && request.method === 'POST') return NextResponse.next();

  if (isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const loginUrl = new URL('/cms/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/cms/:path*', '/api/leads', '/api/config'],
};
