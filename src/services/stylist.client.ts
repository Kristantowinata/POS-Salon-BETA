import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api-fetch';
import type { Stylist } from '../lib/types';

export interface CreateStylistInput {
    name: string;
    email?: string;
    phone?: string;
    role: string;
    commission_rate?: number;
}

export type UpdateStylistInput = Partial<CreateStylistInput> & { is_available?: boolean };

export interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
}

export const stylistClient = {
    list: () =>
        apiGet<Stylist[]>('/stylists'),

    getById: (id: string) =>
        apiGet<Stylist>(`/stylists/${id}`),

    create: (data: CreateStylistInput) =>
        apiPost<Stylist>('/stylists', data),

    update: (id: string, data: UpdateStylistInput) =>
        apiPatch<Stylist>(`/stylists/${id}`, data),

    remove: (id: string) =>
        apiDelete<void>(`/stylists/${id}`),

    getAvailability: (id: string, date: string) =>
        apiGet<TimeSlot[]>(`/stylists/${id}/availability?date=${date}`),
};
