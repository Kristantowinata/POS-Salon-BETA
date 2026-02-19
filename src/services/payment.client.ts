import { apiPost, apiGet } from '../lib/api-fetch';
import type { Payment, PaymentResult, PaymentReceipt } from '../lib/types';

export interface ProcessPaymentInput {
    idempotency_key: string;
    order_id: string;
    method: 'cash' | 'card' | 'qris' | 'debit';
    amount_paid: number;
    notes?: string;
}

// Re-export this for convenience if needed, or import from types
export type { PaymentReceipt };

export const paymentClient = {
    process: (data: ProcessPaymentInput) =>
        apiPost<PaymentResult>('/payments', data),

    getReceipt: (paymentId: string) =>
        apiGet<PaymentReceipt>(`/payments/${paymentId}/receipt`),
};
