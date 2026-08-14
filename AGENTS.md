# FoodMap Admin — hướng dẫn cho AI

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · next-intl

Quy ước đầy đủ nằm ở repo cha: skill `foodmap-domain`, `i18n-workflow`, `api-contract`.
File này chỉ ghi những gì **riêng của repo này**.

---

## Chạy

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

Backend phải đang chạy — xem repo cha.

---

## Bốn thứ dễ sai nhất trong repo này

### 1. Token nằm trong cookie httpOnly → gọi API phải ở phía server

`src/lib/api.ts` được đánh dấu `server-only`. Nó **chỉ** dùng được trong Server Component,
Server Action và Route Handler. Client Component không đọc được token, và đó là **chủ ý**:
một lỗ XSS cũng không lấy được token.

Client cần dữ liệu thì:
- nạp ở Server Component rồi truyền xuống qua props, **hoặc**
- gọi một Route Handler của Next (`src/app/api/...`), route đó gọi backend hộ.

Đăng nhập đi qua `POST /api/session` chứ không gọi thẳng backend từ trình duyệt.

### 2. `middleware.ts` đã đổi tên thành `proxy.ts`

Next.js 16 đổi tên file và đổi tên hàm export từ `middleware` thành `proxy`.
File nằm ở `src/proxy.ts`.

Đây chỉ là lớp bảo vệ **giao diện**. Chặn thật nằm ở backend (NFR-13) — nó chỉ kiểm tra
cookie có tồn tại hay không, **không** xác thực chữ ký JWT.

### 3. Đừng dùng `LayoutProps<'/'>` / `PageProps<...>` nếu cần `tsc --noEmit` riêng

Những kiểu đó được Next sinh vào `.next/types` lúc build, nên `tsc --noEmit` chạy trước
build sẽ báo `Cannot find name 'LayoutProps'`. Khai props tường minh thay vì dựa vào chúng.

### 4. Đừng sửa `src/api/generated/`

Bị ghi đè mỗi lần chạy `../scripts/gen-api-client.sh`. Muốn đổi kiểu dữ liệu API thì
sửa `docs/03-api/openapi.yaml`, rồi sinh lại. Cũng đừng tự khai lại DTO:

```ts
import type { components } from '@/api/generated/schema';
type PlaceSummary = components['schemas']['PlaceSummary'];
```

---

## Cấu trúc

```
src/app/                 App Router
  layout.tsx             NextIntlClientProvider + thanh điều hướng
  page.tsx               Tổng quan
  login/page.tsx         Đăng nhập (Client Component)
  places|reviews|feedbacks/   màn hình quản trị (đang là placeholder)
  api/session/route.ts   đặt và xoá cookie phiên
src/components/          Client Component dùng chung
src/lib/
  api.ts                 client openapi-fetch phía server (server-only)
  session.ts             cookie httpOnly (server-only)
  locale.ts              ngôn ngữ hiện tại từ cookie (server-only)
src/i18n/request.ts      cấu hình next-intl
src/api/generated/       ⚠️ SINH TỰ ĐỘNG — KHÔNG SỬA TAY
src/proxy.ts             chặn route quản trị khi chưa đăng nhập
messages/vi.json en.json chuỗi giao diện
```

next-intl chạy ở chế độ **không định tuyến theo ngôn ngữ** — không có `/vi`, `/en`
trong URL, ngôn ngữ lấy từ cookie. Người dùng nội bộ ít, và URL sạch thì dễ chia sẻ
link giữa các moderator hơn.

---

## Quy ước nghiệp vụ phải giữ đúng

- **Mọi bảng phân trang, lọc và sắp xếp ở phía server** (FR-ADMIN-02). Dữ liệu sẽ lớn;
  phân trang phía client sẽ vỡ.
- **Từ chối đánh giá bắt buộc nhập lý do** — không phải trường tuỳ chọn (FR-REVIEW-05).
- **Hành động không hoàn tác được phải có bước xác nhận riêng** (FR-ADMIN-06):
  xoá địa điểm, từ chối đánh giá, xoá người dùng.
- Ẩn nút theo vai trò chỉ để giao diện gọn — **backend mới là nơi chặn thật**.
- Không hardcode chuỗi tiếng Việt trong JSX. Thêm key phải có cả `vi.json` và `en.json`.

---

## Trước khi báo hoàn thành

- [ ] `npm run typecheck` sạch
- [ ] `npm run lint` sạch
- [ ] `npm run build` thành công
- [ ] Chuỗi mới có cả `vi` và `en`
- [ ] Không sửa file trong `src/api/generated/`
