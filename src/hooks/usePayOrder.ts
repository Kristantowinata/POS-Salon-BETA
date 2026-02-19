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
        onSuccess: (data) => {
            // Check for Midtrans Snap token
            if (data.snap_token && (window as any).snap) {
                (window as any).snap.pay(data.snap_token, {
                    onSuccess: (result: any) => {
                        console.log('Payment success:', result);
                        qc.invalidateQueries({ queryKey: queryKeys.orders.all });
                        qc.invalidateQueries({ queryKey: queryKeys.payments.all });
                        qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
                    },
                    onPending: (result: any) => {
                        console.log('Payment pending:', result);
                        qc.invalidateQueries({ queryKey: queryKeys.payments.all });
                    },
                    onError: (result: any) => {
                        console.error('Payment error:', result);
                    },
                    onClose: () => {
                        console.log('Customer closed the popup without finishing the payment');
                    }
                });
            } else {
                // Cash payment or no token needed
                qc.invalidateQueries({ queryKey: queryKeys.orders.all });
                qc.invalidateQueries({ queryKey: queryKeys.payments.all });
                qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
            }
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
