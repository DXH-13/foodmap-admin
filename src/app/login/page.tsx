'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const t = useTranslations('login');
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(form: LoginForm) {
        setErrorMessage(null);

        // Gọi route handler của Next, không gọi thẳng backend — token phải được đặt
        // vào cookie httpOnly ở phía server. Xem src/app/api/session/route.ts.
        const response = await fetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            setErrorMessage(error?.message ?? t('failed'));
            return;
        }

        router.replace('/');
        router.refresh();
    }

    return (
        <div className="mx-auto mt-[12vh] w-full max-w-sm space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="space-y-3">
                <span className="grid place-items-center size-10 rounded-xl bg-blue-600 text-white font-bold">
                    F
                </span>
                <h1 className="text-xl font-semibold">{t('title')}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <input
                            {...field}
                            type="email"
                            autoComplete="username"
                            placeholder={t('email')}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <input
                            {...field}
                            type="password"
                            autoComplete="current-password"
                            placeholder={t('password')}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    )}
                />

                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                    {t('submit')}
                </button>
            </form>
        </div>
    );
}
