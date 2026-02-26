import { apiGet, apiPost, apiPatch } from '../lib/api-fetch';
import type { Reservation } from '../lib/types';

export interface ReservationListParams {
    page?: number;
    date?: string;
    status?: string;
    search?: string;
}

export interface ReservationListResponse {
    items: Reservation[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateReservationInput {
    customer_id?: string;
    stylist_id?: string;
    type: 'booking' | 'walk_in';
    scheduled_at: string;
    estimated_duration_min?: number;
    service_ids?: string[];
    notes?: string;
}

export interface WalkInServiceItem {
    service_id: string;
    stylist_id?: string;
}

export interface CreateWalkInInput {
    customer_name: string;
    customer_phone?: string;
    service_items: WalkInServiceItem[];
    notes?: string;
}

export interface UpdateReservationInput {
    stylist_id?: string;
    status?: string;
    scheduled_at?: string;
    estimated_duration_min?: number;
    notes?: string;
    version: number;
}

export const reservationClient = {
    list: (params?: ReservationListParams) =>
        apiGet<ReservationListResponse>(`/reservations${buildQueryString(params ?? {})}`),

    getById: (id: string) =>
        apiGet<Reservation>(`/reservations/${id}`),

    create: (data: CreateReservationInput) =>
        apiPost<Reservation>('/reservations', data),

    // Walk-in uses the same POST /reservations endpoint;
    // backend distinguishes by presence of customer_name field.
    createWalkIn: (data: CreateWalkInInput) =>
        apiPost<Reservation>('/reservations', data),

    update: (id: string, data: UpdateReservationInput) =>
        apiPatch<Reservation>(`/reservations/${id}`, data),

    checkIn: (id: string) =>
        apiPost<Reservation>(`/reservations/${id}/check-in`),

    cancel: (id: string, version: number) =>
        apiPatch<Reservation>(`/reservations/${id}`, { status: 'cancelled', version }),
};

// Re-export for convenience
import { buildQueryString } from '../lib/api-fetch';
