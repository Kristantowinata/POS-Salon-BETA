import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { customerClient, type CustomerListParams, type CreateCustomerInput, type UpdateCustomerInput } from '../services/customer.client';

export function useCustomers(params?: CustomerListParams) {
    return useQuery({
        queryKey: queryKeys.customers.list(params),
        queryFn: () => customerClient.list(params),
    });
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: queryKeys.customers.detail(id),
        queryFn: () => customerClient.getById(id),
        enabled: !!id,
    });
}

export function useCustomerHistory(id: string) {
    return useQuery({
        queryKey: queryKeys.customers.history(id),
        queryFn: () => customerClient.getHistory(id),
        enabled: !!id,
    });
}

export function useCreateCustomer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCustomerInput) => customerClient.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.customers.all });
        },
    });
}

export function useUpdateCustomer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
            customerClient.update(id, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.id) });
            qc.invalidateQueries({ queryKey: queryKeys.customers.all });
        },
    });
}

export function useDeleteCustomer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => customerClient.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.customers.all });
        },
    });
}
