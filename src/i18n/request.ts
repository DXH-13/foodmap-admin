import { getRequestConfig } from 'next-intl/server';

import { getLocale } from '@/lib/locale';

/**
 * Cấu hình next-intl ở chế độ **không định tuyến theo ngôn ngữ**.
 *
 * Ngôn ngữ lấy từ cookie thay vì từ đường dẫn — trang quản trị dùng nội bộ, và URL
 * không có tiền tố `/vi` / `/en` thì dễ chia sẻ link giữa các moderator hơn.
 */
export default getRequestConfig(async () => {
    const locale = await getLocale();

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});
