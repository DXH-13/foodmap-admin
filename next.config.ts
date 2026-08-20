import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// Trỏ tới cấu hình next-intl (chế độ không định tuyến theo ngôn ngữ)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    // Xuất bản standalone để đóng gói Docker gọn — xem docs/SDD/van-hanh/deployment.md
    output: 'standalone',
};

export default withNextIntl(nextConfig);
