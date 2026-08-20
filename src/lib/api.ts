import 'server-only';

import createClient, { type Middleware } from 'openapi-fetch';

import type { paths } from '@/api/generated/schema';

import { getLocale } from './locale';
import { getAccessToken } from './session';

/**
 * Client HTTP **phía server**, sinh kiểu từ `docs/SDD/api/openapi.yaml`.
 *
 * Chỉ dùng được trong Server Component, Server Action và Route Handler — vì token
 * nằm trong cookie httpOnly mà trình duyệt không đọc được. Đây là chủ ý:
 * xem `lib/session.ts`.
 */

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8080';

const serverAuthMiddleware: Middleware = {
    async onRequest({ request }) {
        const token = await getAccessToken();
        if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
        }
        // Backend dịch `ApiError.message` theo header này; `code` thì giữ nguyên.
        request.headers.set('Accept-Language', await getLocale());
        return request;
    },
};

export const api = createClient<paths>({ baseUrl: API_BASE_URL });
api.use(serverAuthMiddleware);

export { API_BASE_URL };
