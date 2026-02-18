import { apiGet, apiPatch, apiPost, apiDelete, buildQueryString } from '../lib/api-fetch';
import type { Order, OrderItem } from '../lib/types';

export interface OrderListParams {
    page?: number;
    status?: string;
}

export interface AddOrderItemInput {
    item_type: 'service' | 'product' | 'package' | 'addon';
    service_id?: string;
    product_id?: string;
    name: string;
    unit_price: number;
    quantity: number;
    stylist_id?: string;
}

export interface UpdateOrderItemInput {
    quantity?: number;
    unit_price?: number;
}

export const orderClient = {
    list: (params?: OrderListParams) =>
        apiGet<Order[]>(`/orders${buildQueryString(params ?? {})}`),

    getById: (id: string) =>
        apiGet<Order>(`/orders/${id}`),

    update: (id: string, data: { status?: string; notes?: string; version: number }) =>
        apiPatch<Order>(`/orders/${id}`, data),

    addItem: (orderId: string, data: AddOrderItemInput) =>
        apiPost<OrderItem>(`/orders/${orderId}/items`, data),

    updateItem: (orderId: string, itemId: string, data: UpdateOrderItemInput) =>
        apiPatch<OrderItem>(`/orders/${orderId}/items/${itemId}`, data),

    removeItem: (orderId: string, itemId: string) =>
        apiDelete<void>(`/orders/${orderId}/items/${itemId}`),
};
