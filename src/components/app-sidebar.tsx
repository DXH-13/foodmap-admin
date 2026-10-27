'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

/** Path của icon Heroicons (outline, 24px) — chép thẳng để khỏi thêm thư viện icon. */
const ICONS = {
    dashboard:
        'm2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    places:
        'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
    reviews:
        'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
    feedbacks:
        'M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5',
    logout: 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9',
} as const;

function Icon({ path }: { path: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
            className="size-5 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}

/**
 * Sidebar điều hướng. Màn hình hẹp thì gập thành thanh ngang ở trên cùng.
 *
 * Ẩn mục theo trạng thái đăng nhập chỉ để giao diện gọn — **backend mới là nơi chặn thật**
 * (NFR-13). Đừng bao giờ coi việc ẩn nút là biện pháp bảo vệ.
 */
export function AppSidebar({ signedIn }: { signedIn: boolean }) {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();

    // Trang đăng nhập đứng một mình, không có sidebar
    if (pathname === '/login') {
        return null;
    }

    const links = [
        { href: '/', label: t('nav.dashboard'), icon: ICONS.dashboard },
        { href: '/places', label: t('nav.places'), icon: ICONS.places },
        { href: '/reviews', label: t('nav.reviews'), icon: ICONS.reviews },
        { href: '/feedbacks', label: t('nav.feedbacks'), icon: ICONS.feedbacks },
    ];

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

    async function signOut() {
        await fetch('/api/session', { method: 'DELETE' });
        router.replace('/login');
        router.refresh();
    }

    return (
        <aside className="flex md:flex-col shrink-0 items-center md:items-stretch gap-2 md:gap-0 border-b md:border-b-0 md:border-r border-neutral-200 bg-white px-4 py-3 md:p-0 md:w-60 md:h-screen md:sticky md:top-0">
            <Link href="/" className="flex items-center gap-2.5 md:px-5 md:h-16 md:border-b border-neutral-100">
                <span className="grid place-items-center size-8 rounded-lg bg-blue-600 text-white text-sm font-bold">
                    F
                </span>
                <span className="hidden sm:block leading-tight">
                    <span className="block font-semibold text-neutral-900">FoodMap</span>
                    <span className="block text-xs text-neutral-500">Admin</span>
                </span>
            </Link>

            <nav className="flex-1 overflow-x-auto md:overflow-visible md:px-3 md:py-4">
                <ul className="flex md:flex-col gap-1">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                                className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                }`}>
                                <Icon path={link.icon} />
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="md:border-t border-neutral-100 md:p-3">
                {signedIn ? (
                    <button
                        type="button"
                        onClick={() => void signOut()}
                        className="flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900">
                        <Icon path={ICONS.logout} />
                        <span className="hidden sm:inline">{t('nav.logout')}</span>
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                        {t('nav.signIn')}
                    </Link>
                )}
            </div>
        </aside>
    );
}
