import 'server-only';

import { cookies } from 'next/headers';

/**
 * Phiên đăng nhập của trang quản trị.
 *
 * Token lưu trong cookie **httpOnly** — JavaScript phía client không đọc được, nên
 * một lỗ XSS cũng không lấy được token. Đánh đổi: mọi lời gọi API cần xác thực phải
 * chạy ở phía server (Server Component, Server Action, hoặc Route Handler),
 * không gọi thẳng từ trình duyệt.
 */

const ACCESS_TOKEN_COOKIE = 'foodmap_at';
const REFRESH_TOKEN_COOKIE = 'foodmap_rt';

export async function getAccessToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function isSignedIn(): Promise<boolean> {
    return (await getAccessToken()) !== null;
}

export async function setSessionCookies(
    accessToken: string,
    refreshToken: string,
    accessTokenTtlSeconds: number,
): Promise<void> {
    const store = await cookies();
    const secure = process.env.NODE_ENV === 'production';

    store.set(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: accessTokenTtlSeconds,
    });

    store.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        // Refresh token sống 30 ngày (FR-AUTH-03)
        maxAge: 60 * 60 * 24 * 30,
    });
}

export async function clearSessionCookies(): Promise<void> {
    const store = await cookies();
    store.delete(ACCESS_TOKEN_COOKIE);
    store.delete(REFRESH_TOKEN_COOKIE);
}

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };
