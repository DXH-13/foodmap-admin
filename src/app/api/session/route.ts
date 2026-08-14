import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/lib/api';
import { clearSessionCookies, setSessionCookies } from '@/lib/session';

/**
 * Đổi email + mật khẩu lấy phiên đăng nhập.
 *
 * Trình duyệt **không** gọi thẳng backend để đăng nhập: route handler này gọi hộ,
 * rồi đặt token vào cookie httpOnly. Nhờ vậy token không bao giờ nằm trong tầm với
 * của JavaScript phía client, kể cả khi có lỗ XSS.
 */
export async function POST(request: Request) {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        // Chuyển nguyên ApiError của backend về client — `code` để phân nhánh,
        // `message` để hiển thị.
        const error = await response.json().catch(() => null);
        return NextResponse.json(error ?? { code: 'LOGIN_FAILED' }, { status: response.status });
    }

    const tokens = await response.json();

    // Chỉ MODERATOR và ADMIN được vào trang quản trị (FR-ADMIN-01).
    if (tokens.user?.role !== 'MODERATOR' && tokens.user?.role !== 'ADMIN') {
        return NextResponse.json({ code: 'FORBIDDEN' }, { status: 403 });
    }

    await setSessionCookies(tokens.accessToken, tokens.refreshToken, tokens.expiresIn);
    return NextResponse.json({ user: tokens.user });
}

/** Đăng xuất — xoá cookie phiên. */
export async function DELETE() {
    await clearSessionCookies();
    return new NextResponse(null, { status: 204 });
}
