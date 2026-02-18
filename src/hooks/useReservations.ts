import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import {
    reservationClient,
    type ReservationListParams,
    type CreateReservationInput,
    type CreateWalkInInput,
    type UpdateReservationInput,
} from '../services/reservation.client';

export function useReservations(params?: ReservationListParams) {
    return useQuery({
        queryKey: queryKeys.reservations.list(params),
        queryFn: () => reservationClient.list(params),
    });
}

export function useReservation(id: string) {
    return useQuery({
        queryKey: queryKeys.reservations.detail(id),
        queryFn: () => reservationClient.getById(id),
        enabled: !!id,
    });
}

export function useCreateReservation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateReservationInput) => reservationClient.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.reservations.all });
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
}

export function useCreateWalkIn() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateWalkInInput) => reservationClient.createWalkIn(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.reservations.all });
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
            qc.invalidateQueries({ queryKey: queryKeys.customers.all });
        },
    });
}

export function useUpdateReservation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateReservationInput }) =>
            reservationClient.update(id, data),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: queryKeys.reservations.detail(variables.id) });
            qc.invalidateQueries({ queryKey: queryKeys.reservations.all });
        },
    });
}

export function useCheckInReservation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => reservationClient.checkIn(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.reservations.all });
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
}
