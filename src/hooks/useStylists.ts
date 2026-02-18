import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { stylistClient, type CreateStylistInput, type UpdateStylistInput } from '../services/stylist.client';

export function useStylists() {
    return useQuery({
        queryKey: queryKeys.stylists.list(),
        queryFn: stylistClient.list,
    });
}

export function useStylist(id: string) {
    return useQuery({
        queryKey: queryKeys.stylists.detail(id),
        queryFn: () => stylistClient.getById(id),
        enabled: !!id,
    });
}

export function useStylistAvailability(id: string, date: string) {
    return useQuery({
        queryKey: queryKeys.stylists.availability(id, date),
        queryFn: () => stylistClient.getAvailability(id, date),
        enabled: !!id && !!date,
    });
}

export function useCreateStylist() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateStylistInput) => stylistClient.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.stylists.all });
        },
    });
}

export function useUpdateStylist() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStylistInput }) =>
            stylistClient.update(id, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.stylists.detail(variables.id) });
            qc.invalidateQueries({ queryKey: queryKeys.stylists.all });
        },
    });
}

export function useDeleteStylist() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => stylistClient.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.stylists.all });
        },
    });
}
