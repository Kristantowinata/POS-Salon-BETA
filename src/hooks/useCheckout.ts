import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { checkoutClient, type CheckoutInput } from '../services/checkout.client';

/**
 * useCheckout — atomic checkout mutation.
 * On success, invalidates orders, dashboard, and inventory caches.
 */
export function useCheckout() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CheckoutInput) => checkoutClient.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.orders.all });
            qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
            qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
        },
    });
}
