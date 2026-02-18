import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from '../lib/api-fetch';
import type { Product } from '../lib/types';

export interface ProductListParams {
    page?: number;
    search?: string;
    category?: string;
    status?: string;
}

export interface CreateProductInput {
    category_id: string;
    name: string;
    sku: string;
    description?: string;
    buy_price: number;
    sell_price: number;
    stock_qty?: number;
    min_stock_qty?: number;
    unit?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    version: number;
}

export interface RestockInput {
    quantity: number;
    notes?: string;
}

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

export const inventoryClient = {
    listProducts: async (params?: ProductListParams): Promise<Product[]> => {
        const result = await apiGet<PaginatedResponse<Product>>(`/inventory/products${buildQueryString(params ?? {})}`);
        return result.items;
    },

    getProduct: (id: string) =>
        apiGet<Product>(`/inventory/products/${id}`),

    createProduct: (data: CreateProductInput) =>
        apiPost<Product>('/inventory/products', data),

    updateProduct: (id: string, data: UpdateProductInput) =>
        apiPatch<Product>(`/inventory/products/${id}`, data),

    deleteProduct: (id: string) =>
        apiDelete<void>(`/inventory/products/${id}`),

    restock: (id: string, data: RestockInput) =>
        apiPost<Product>(`/inventory/products/${id}/restock`, data),
};
