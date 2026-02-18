import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { serviceClient, type CreateServiceInput, type UpdateServiceInput } from '../services/service.client';

export function useServices() {
    return useQuery({
        queryKey: queryKeys.services.list(),
        queryFn: serviceClient.list,
    });
}

export function useService(id: string) {
    return useQuery({
        queryKey: queryKeys.services.detail(id),
        queryFn: () => serviceClient.getById(id),
        enabled: !!id,
    });
}

export function useCreateService() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateServiceInput) => serviceClient.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.services.all });
        },
    });
}

export function useUpdateService() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateServiceInput }) =>
            serviceClient.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.services.all });
        },
    });
}

export function useDeleteService() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => serviceClient.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.services.all });
        },
    });
}
