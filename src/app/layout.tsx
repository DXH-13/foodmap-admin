import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { AppNav } from '@/components/app-nav';
import { getLocale } from '@/lib/locale';
import { isSignedIn } from '@/lib/session';

import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'FoodMap Admin',
    description: 'Trang quản trị FoodMap — kiểm duyệt nội dung và quản lý địa điểm',
};

// Khai kiểu props tường minh thay vì dùng `LayoutProps<'/'>`: kiểu đó được Next sinh
// vào `.next/types` lúc build, nên `tsc --noEmit` chạy trước build sẽ không tìm thấy.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const messages = await getMessages();
    const signedIn = await isSignedIn();

    return (
        <html
            lang={locale}
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
                <NextIntlClientProvider messages={messages}>
                    <AppNav signedIn={signedIn} />
                    <main className="flex-1 px-6 py-8 max-w-5xl w-full mx-auto">{children}</main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
