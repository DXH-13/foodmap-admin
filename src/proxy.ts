import { NextResponse, type NextRequest } from 'next/server';

import { ACCESS_TOKEN_COOKIE } from '@/lib/session';

/**
 * Chặn các màn hình quản trị khi chưa đăng nhập.
 *
 * Next.js 16 đổi tên `middleware.ts` thành `proxy.ts`, và hàm `middleware` thành `proxy`.
 *
 * Đây chỉ là lớp bảo vệ **giao diện** để người dùng không thấy trang trống rồi bối rối.
 * Việc chặn thật nằm ở backend: mọi endpoint `/api/v1/admin/**` đều kiểm tra vai trò
 * (NFR-13). Lớp này chỉ nhìn thấy cookie có tồn tại hay không, **không** xác thực chữ ký.
 */
export function proxy(request: NextRequest) {
    const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE);

    if (!hasSession) {
        const loginUrl = new URL('/login', request.url);
        // Giữ lại đích đến để quay lại đúng chỗ sau khi đăng nhập
        loginUrl.searchParams.set('next', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Trang Tổng quan (`/`) cố ý để mở ở giai đoạn skeleton: backend chưa có endpoint
    // đăng nhập, và trang này đang dùng để kiểm tra kết nối. Thêm `/` vào danh sách
    // dưới đây khi Phase 1 hoàn thành.
    matcher: ['/places/:path*', '/reviews/:path*', '/feedbacks/:path*', '/users/:path*'],
};
