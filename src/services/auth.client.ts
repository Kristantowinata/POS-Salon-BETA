import { apiPost, apiGet } from '../lib/api-fetch';
import type { AuthUser, LoginResponse } from '../lib/types';

export const authClient = {
    login: (email: string, password: string) =>
        apiPost<LoginResponse>('/auth/login', { email, password }, true),

    logout: () =>
        apiPost<void>('/auth/logout'),

    getMe: () =>
        apiGet<AuthUser>('/auth/me'),
};
