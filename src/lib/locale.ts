import 'server-only';

import { cookies } from 'next/headers';

export const SUPPORTED_LOCALES = ['vi', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'vi';

export const LOCALE_COOKIE = 'foodmap_locale';

/**
 * Ngôn ngữ hiện tại, lấy từ cookie.
 *
 * Trang quản trị không dùng i18n theo đường dẫn (`/vi/...`, `/en/...`) — người dùng
 * nội bộ ít, và URL sạch thì dễ chia sẻ link giữa các moderator hơn.
 */
export async function getLocale(): Promise<SupportedLocale> {
    const store = await cookies();
    const value = store.get(LOCALE_COOKIE)?.value;
    return SUPPORTED_LOCALES.includes(value as SupportedLocale)
        ? (value as SupportedLocale)
        : DEFAULT_LOCALE;
}
