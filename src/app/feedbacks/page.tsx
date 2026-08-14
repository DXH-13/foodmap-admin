import { getTranslations } from 'next-intl/server';

/**
 * Xử lý góp ý của người dùng.
 *
 * TODO(Phase 3): nối vào GET /api/v1/admin/feedbacks và POST .../resolve.
 * Ưu tiên hiển thị địa điểm có `needsReview = true` — chúng đã bị 3 người báo
 * đóng cửa vĩnh viễn trong 30 ngày (FR-FEEDBACK-05).
 */
export default async function FeedbacksPage() {
    const t = await getTranslations();

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold">{t('nav.feedbacks')}</h1>
            <p className="text-neutral-600">{t('placeholder.comingSoon')}</p>
            <p className="text-sm text-neutral-500">{t('placeholder.seeRoadmap')}</p>
        </div>
    );
}
