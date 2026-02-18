import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { paymentClient, type ProcessPaymentInput } from '../services/payment.client';

/**
 * usePayOrder — process payment mutation.
 * On success, invalidates orders, payments, and dashboard caches.
 */
export function usePayOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: ProcessPaymentInput) => paymentClient.process(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.all });
            qc.invalidateQueries({ queryKey: queryKeys.payments.all });
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
}

/**
 * useReceipt — fetch payment receipt.
 */
export function useReceipt(paymentId: string) {
    return useQuery({
        queryKey: queryKeys.payments.receipt(paymentId),
        queryFn: () => paymentClient.getReceipt(paymentId),
        enabled: !!paymentId,
    });
}
