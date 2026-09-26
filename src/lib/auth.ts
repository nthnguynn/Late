import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Đăng nhập trang quản trị (CMS): chỉ có MỘT tài khoản quản trị, không có chức năng tạo tài khoản.
// Mặc định admin / admin; có thể ghi đè bằng ADMIN_USERNAME, ADMIN_PASSWORD trong file .env.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export const SESSION_COOKIE = 'nga_admin_session';
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 ngày (giây)

const sha256 = (value: string) => createHash('sha256').update(value).digest();

// So sánh chuỗi không lộ thời gian (chống đoán dần từng ký tự)
const safeEqual = (a: string, b: string) => timingSafeEqual(sha256(a), sha256(b));

export function isAuthConfigured() {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);
}

// Khoá ký cookie. Mặc định suy ra từ mật khẩu nên đổi mật khẩu là mọi phiên cũ hết hiệu lực.
function secret() {
  return process.env.AUTH_SECRET || `nga-admin:${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function verifyCredentials(username: string, password: string) {
  // Luôn so sánh cả hai để thời gian phản hồi không lộ việc sai tài khoản hay sai mật khẩu
  const userOk = safeEqual(username, ADMIN_USERNAME);
  const passOk = safeEqual(password, ADMIN_PASSWORD);
  return userOk && passOk;
}

export function createSessionToken() {
  const expiresAt = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isValidSessionToken(token: string | undefined) {
  if (!token || !isAuthConfigured()) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) return false;
  if (!safeEqual(signature, sign(expiresAt))) return false;
  return Number(expiresAt) > Date.now();
}

// Đọc cookie phiên từ header của request (dùng trong route handler)
export function isAdminRequest(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  return isValidSessionToken(match?.slice(SESSION_COOKIE.length + 1));
}

// Giới hạn số lần đăng nhập sai theo IP: tối đa 5 lần / 15 phút
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const failedAttempts = new Map<string, { count: number; firstAt: number }>();

export function isRateLimited(ip: string) {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(ip: string) {
  const entry = failedAttempts.get(ip);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, firstAt: Date.now() });
  } else {
    entry.count += 1;
  }
}

export function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

export function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
}
