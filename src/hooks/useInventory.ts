import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import {
    inventoryClient,
    type ProductListParams,
    type CreateProductInput,
    type UpdateProductInput,
    type RestockInput,
} from '../services/inventory.client';

export function useProducts(params?: ProductListParams) {
    return useQuery({
        queryKey: queryKeys.inventory.list(params),
        queryFn: () => inventoryClient.listProducts(params),
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: queryKeys.inventory.detail(id),
        queryFn: () => inventoryClient.getProduct(id),
        enabled: !!id,
    });
}

export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductInput) => inventoryClient.createProduct(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
        },
    });
}

export function useUpdateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
            inventoryClient.updateProduct(id, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.inventory.detail(variables.id) });
            qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
        },
    });
}

export function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => inventoryClient.deleteProduct(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
        },
    });
}

export function useRestock() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RestockInput }) =>
            inventoryClient.restock(id, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.inventory.detail(variables.id) });
            qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
}
