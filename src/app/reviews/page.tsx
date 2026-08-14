import { getTranslations } from 'next-intl/server';

/**
 * Hàng chờ kiểm duyệt đánh giá.
 *
 * TODO(Phase 3): nối vào GET /api/v1/admin/reviews và POST .../moderate.
 * Yêu cầu quan trọng khi làm: hiển thị đủ ngữ cảnh ngay trong danh sách
 * (ảnh thu nhỏ, tên quán, số lần tác giả bị từ chối trước đó — FR-ADMIN-03),
 * và từ chối BẮT BUỘC nhập lý do (FR-REVIEW-05).
 */
export default async function ReviewsPage() {
    const t = await getTranslations();

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold">{t('nav.reviews')}</h1>
            <p className="text-neutral-600">{t('placeholder.comingSoon')}</p>
            <p className="text-sm text-neutral-500">{t('placeholder.seeRoadmap')}</p>
        </div>
    );
}
