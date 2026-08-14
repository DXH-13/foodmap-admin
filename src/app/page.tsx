import { getTranslations } from 'next-intl/server';

import { api } from '@/lib/api';

/**
 * Tổng quan.
 *
 * Ở giai đoạn skeleton, trang này gọi một endpoint **công khai** thật để chứng minh
 * cả chuỗi kết nối chạy được: Next server → backend Spring Boot → PostgreSQL/PostGIS.
 *
 * TODO(Phase 6): thay bằng GET /api/v1/admin/stats khi backend đã có endpoint đó.
 */
export default async function DashboardPage() {
    const t = await getTranslations('dashboard');

    // Trung tâm TP.HCM — chỉ để kiểm tra kết nối
    const { data, error } = await api.GET('/api/v1/places/nearby', {
        params: {
            query: { latitude: 10.7724, longitude: 106.698, radiusMeters: 5000, size: 10 },
        },
    });

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold">{t('title')}</h1>

            <section className="rounded-lg border border-neutral-200 bg-white p-5">
                <h2 className="text-sm font-medium text-neutral-500 mb-2">
                    {t('connectionTitle')}
                </h2>

                {error ? (
                    <div className="space-y-1">
                        <p className="text-red-600 font-medium">{t('connectionFailed')}</p>
                        <p className="text-sm text-neutral-500">{t('connectionHint')}</p>
                    </div>
                ) : (
                    <p className="text-green-700 font-medium">
                        {t('connectionOk')} — {data?.totalElements ?? 0}
                    </p>
                )}
            </section>

            {data && data.content.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-sm font-medium text-neutral-500">{t('samplePlaces')}</h2>

                    <ul className="rounded-lg border border-neutral-200 bg-white divide-y divide-neutral-100">
                        {data.content.map((place) => (
                            <li
                                key={place.id}
                                className="px-5 py-3 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="font-medium truncate">{place.name}</p>
                                    <p className="text-sm text-neutral-500 truncate">
                                        {place.address ?? '—'}
                                    </p>
                                </div>

                                <div className="text-right text-sm shrink-0">
                                    {/* averageRating là null khi chưa có đánh giá — không hiển thị 0 sao */}
                                    <p>
                                        {place.averageRating == null
                                            ? t('noRating')
                                            : `★ ${place.averageRating}`}
                                    </p>
                                    {place.distanceMeters != null && (
                                        <p className="text-neutral-500">
                                            {Math.round(place.distanceMeters)}m
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
