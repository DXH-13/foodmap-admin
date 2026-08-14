import { getTranslations } from 'next-intl/server';

/**
 * Quản lý địa điểm.
 *
 * TODO(Phase 2): bảng có phân trang/lọc/sắp xếp phía server (FR-ADMIN-02) và form
 * thêm/sửa với công cụ chọn toạ độ trên bản đồ — không bắt nhập tay lat/lng (FR-ADMIN-05).
 */
export default async function PlacesPage() {
    const t = await getTranslations();

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold">{t('nav.places')}</h1>
            <p className="text-neutral-600">{t('placeholder.comingSoon')}</p>
            <p className="text-sm text-neutral-500">{t('placeholder.seeRoadmap')}</p>
        </div>
    );
}
