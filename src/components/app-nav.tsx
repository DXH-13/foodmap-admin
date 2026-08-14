'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

/**
 * Thanh điều hướng.
 *
 * Ẩn mục theo trạng thái đăng nhập chỉ để giao diện gọn — **backend mới là nơi chặn thật**
 * (NFR-13). Đừng bao giờ coi việc ẩn nút là biện pháp bảo vệ.
 */
export function AppNav({ signedIn }: { signedIn: boolean }) {
    const t = useTranslations('nav');
    const pathname = usePathname();
    const router = useRouter();

    const links = [
        { href: '/', label: t('dashboard') },
        { href: '/places', label: t('places') },
        { href: '/reviews', label: t('reviews') },
        { href: '/feedbacks', label: t('feedbacks') },
    ];

    async function signOut() {
        await fetch('/api/session', { method: 'DELETE' });
        router.refresh();
    }

    return (
        <header className="border-b border-neutral-200 bg-white">
            <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
                <Link href="/" className="font-semibold">
                    FoodMap Admin
                </Link>

                <ul className="flex gap-4 text-sm flex-1">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={
                                    pathname === link.href
                                        ? 'text-blue-600 font-medium'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                }>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {signedIn ? (
                    <button
                        type="button"
                        onClick={() => void signOut()}
                        className="text-sm text-neutral-600 hover:text-neutral-900">
                        {t('logout')}
                    </button>
                ) : (
                    <Link href="/login" className="text-sm text-blue-600 font-medium">
                        {t('signIn')}
                    </Link>
                )}
            </nav>
        </header>
    );
}
