import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { orderClient, type OrderListParams, type AddOrderItemInput, type UpdateOrderItemInput } from '../services/order.client';

export function useOrders(params?: OrderListParams) {
    return useQuery({
        queryKey: queryKeys.orders.list(params),
        queryFn: () => orderClient.list(params),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: () => orderClient.getById(id),
        enabled: !!id,
    });
}

export function useUpdateOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { status?: string; notes?: string; version: number } }) =>
            orderClient.update(id, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) });
            qc.invalidateQueries({ queryKey: queryKeys.orders.all });
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
}

export function useAddOrderItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: string; data: AddOrderItemInput }) =>
            orderClient.addItem(orderId, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.orderId) });
        },
    });
}

export function useUpdateOrderItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, itemId, data }: { orderId: string; itemId: string; data: UpdateOrderItemInput }) =>
            orderClient.updateItem(orderId, itemId, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.orderId) });
        },
    });
}

export function useRemoveOrderItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
            orderClient.removeItem(orderId, itemId),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.orderId) });
            qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
        },
    });
}
