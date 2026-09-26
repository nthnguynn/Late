import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  clearFailedAttempts,
  clientIp,
  createSessionToken,
  isAuthConfigured,
  isRateLimited,
  recordFailedAttempt,
  verifyCredentials,
} from '@/lib/auth';

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình tài khoản quản trị.' }, { status: 503 });
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' },
      { status: 429 }
    );
  }

  let username = '';
  let password = '';
  try {
    const body = await request.json();
    username = typeof body.username === 'string' ? body.username : '';
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    // body không hợp lệ → coi như sai thông tin
  }

  if (!verifyCredentials(username, password)) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: 'Sai tài khoản hoặc mật khẩu.' }, { status: 401 });
  }

  clearFailedAttempts(ip);
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
