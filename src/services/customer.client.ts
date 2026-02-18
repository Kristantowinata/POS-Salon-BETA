import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from '../lib/api-fetch';
import type { Customer } from '../lib/types';

export interface CustomerListParams {
    page?: number;
    search?: string;
    tier?: string;
}

export interface CreateCustomerInput {
    name: string;
    phone?: string;
    email?: string;
    date_of_birth?: string;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

export const customerClient = {
    list: async (params?: CustomerListParams): Promise<Customer[]> => {
        const result = await apiGet<PaginatedResponse<Customer>>(`/customers${buildQueryString(params ?? {})}`);
        return result.items;
    },

    getById: (id: string) =>
        apiGet<Customer>(`/customers/${id}`),

    create: (data: CreateCustomerInput) =>
        apiPost<Customer>('/customers', data),

    update: (id: string, data: UpdateCustomerInput) =>
        apiPatch<Customer>(`/customers/${id}`, data),

    remove: (id: string) =>
        apiDelete<void>(`/customers/${id}`),

    getHistory: (id: string) =>
        apiGet<unknown[]>(`/customers/${id}/history`),
};
