/**
 * apiFetch — centralized HTTP utility for backend communication.
 *
 * - Auto-attaches JWT from localStorage
 * - Throws ApiError on non-2xx (required by TanStack Query)
 * - Returns unwrapped data directly
 * - Auto-logout on 401
 */

import type { ApiErrorResponse } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
    readonly errorCode: string;
    readonly status: number;
    readonly details?: Record<string, unknown>;

    constructor(
        errorCode: string,
        message: string,
        status: number,
        details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ApiError';
        this.errorCode = errorCode;
        this.status = status;
        this.details = details;
    }
}

interface FetchOptions {
    method?: string;
    body?: unknown;
    skipAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { method = 'GET', body, skipAuth = false } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('auth_token');
    if (token && !skipAuth) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
        if (!response.ok) {
            throw new ApiError('NETWORK_ERROR', `HTTP ${response.status}`, response.status);
        }
        return {} as T;
    }

    const json = await response.json();

    if (!response.ok) {
        const err = json as ApiErrorResponse;

        // Auto-logout on 401
        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.dispatchEvent(new Event('auth:logout'));
        }

        throw new ApiError(
            err.errorCode || 'UNKNOWN_ERROR',
            err.error || 'Something went wrong',
            response.status,
            err.details
        );
    }

    // Backend wraps responses in { data: T }, unwrap it
    return json.data as T;
}

// ─── Convenience wrappers ────────────────────────────────────────────

export function apiGet<T>(path: string) {
    return apiFetch<T>(path);
}

export function apiPost<T>(path: string, body?: unknown, skipAuth = false) {
    return apiFetch<T>(path, { method: 'POST', body, skipAuth });
}

export function apiPatch<T>(path: string, body?: unknown) {
    return apiFetch<T>(path, { method: 'PATCH', body });
}

export function apiDelete<T>(path: string) {
    return apiFetch<T>(path, { method: 'DELETE' });
}

// ─── Query string helper ────────────────────────────────────────────

export function buildQueryString(params: object): string {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            qs.set(key, String(value));
        }
    }
    const str = qs.toString();
    return str ? `?${str}` : '';
}
