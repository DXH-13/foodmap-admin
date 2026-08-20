# FoodMap Admin

Trang quản trị của [FoodMap](https://github.com/DXH-13/foodmap) — kiểm duyệt nội dung
và quản lý địa điểm.

**Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · next-intl**

Repo này là submodule `admin/` của repo cha. Dành cho `MODERATOR` và `ADMIN`.

## Bắt đầu

```bash
npm install
cp .env.example .env.local
npm run dev              # http://localhost:3000
```

Backend phải đang chạy — xem repo cha:

```bash
cd ..
./scripts/dev-up.sh
cd backend && ./gradlew bootRun
```

## Lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Build và chạy bản production |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |
| `npm run lint` | ESLint |

## Xác thực

Token nằm trong cookie **httpOnly** — JavaScript phía client không đọc được, nên một
lỗ XSS cũng không lấy được token.

Hệ quả: mọi lời gọi API cần xác thực phải chạy ở **phía server** (Server Component,
Server Action, Route Handler). Đăng nhập đi qua `POST /api/session`, route đó gọi backend
hộ rồi đặt cookie.

`src/proxy.ts` (Next.js 16 đổi tên từ `middleware.ts`) chuyển hướng về `/login` khi chưa
có cookie phiên. Đó chỉ là lớp bảo vệ giao diện — **backend mới là nơi chặn thật**.

## Trạng thái hiện tại

Đây là **skeleton**. Đã chạy được:

- Tổng quan gọi API thật và hiển thị danh sách địa điểm từ backend
- Chuyển ngôn ngữ vi/en bằng next-intl
- Chặn route quản trị khi chưa đăng nhập
- Route handler đặt và xoá cookie phiên

Chưa có: form đăng nhập **chưa hoạt động** vì backend chưa implement
`POST /api/v1/auth/login` (thuộc Phase 1 của lộ trình). Các trang Địa điểm, Duyệt đánh giá,
Xử lý góp ý hiện là placeholder — xem `docs/Management-Plan/lo-trinh-v1.md`.

## Client API

`src/api/generated/` được **sinh tự động** từ `docs/SDD/api/openapi.yaml`.
**Đừng sửa tay** — chạy lại generator ở repo cha:

```bash
cd .. && ./scripts/gen-api-client.sh
```

## Tài liệu

Yêu cầu và danh sách màn hình: `docs/SRS/srs.md`, `docs/SDD/giao-dien/screens.md`.
Quy ước code: [`AGENTS.md`](./AGENTS.md).
