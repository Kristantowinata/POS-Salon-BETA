import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api-fetch';
import type { Service } from '../lib/types';

export interface CreateServiceInput {
    category_id: string;
    name: string;
    description?: string;
    price: number;
    duration_minutes: number;
    icon?: string;
}

export type UpdateServiceInput = Partial<CreateServiceInput>;

// The API returns categories with nested services
interface ServiceCategoryResponse {
    id: string;
    name: string;
    services: Omit<Service, 'service_categories'>[];
}

export const serviceClient = {
    list: async (): Promise<Service[]> => {
        const categories = await apiGet<ServiceCategoryResponse[]>('/services');
        // Flatten: extract services from each category and attach category info
        return categories.flatMap(cat =>
            (cat.services ?? []).map(svc => ({
                ...svc,
                service_categories: { name: cat.name },
            } as Service))
        );
    },

    getById: (id: string) =>
        apiGet<Service>(`/services/${id}`),

    create: (data: CreateServiceInput) =>
        apiPost<Service>('/services', data),

    update: (id: string, data: UpdateServiceInput) =>
        apiPatch<Service>(`/services/${id}`, data),

    remove: (id: string) =>
        apiDelete<void>(`/services/${id}`),
};
