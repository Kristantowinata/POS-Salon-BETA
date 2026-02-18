import { apiGet, apiPost, apiPatch, buildQueryString } from '../lib/api-fetch';
import type { Reservation } from '../lib/types';

export interface ReservationListParams {
    page?: number;
    date?: string;
    status?: string;
    search?: string;
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

export interface CreateWalkInInput {
    customer_name: string;
    customer_phone?: string;
    stylist_id?: string;
    service_ids?: string[];
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
        apiGet<Reservation[]>(`/reservations${buildQueryString(params ?? {})}`),

    getById: (id: string) =>
        apiGet<Reservation>(`/reservations/${id}`),

    create: (data: CreateReservationInput) =>
        apiPost<Reservation>('/reservations', data),

    createWalkIn: (data: CreateWalkInInput) =>
        apiPost<Reservation>('/reservations/walk-in', data),

    update: (id: string, data: UpdateReservationInput) =>
        apiPatch<Reservation>(`/reservations/${id}`, data),

    checkIn: (id: string) =>
        apiPost<Reservation>(`/reservations/${id}/check-in`),
};
