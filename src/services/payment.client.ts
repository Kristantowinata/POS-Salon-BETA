import { apiPost, apiGet } from '../lib/api-fetch';
import type { Payment } from '../lib/types';

export interface ProcessPaymentInput {
    idempotency_key: string;
    order_id: string;
    method: 'cash' | 'card' | 'qris' | 'debit';
    amount_paid: number;
    notes?: string;
}

export interface PaymentReceipt {
    payment: Payment;
    order: {
        order_number: string;
        subtotal: number;
        tax_amount: number;
        discount_amount: number;
        total: number;
        items: Array<{ name: string; quantity: number; unit_price: number; subtotal: number }>;
    };
    salon: {
        name: string;
        currency: string;
    };
}

export const paymentClient = {
    process: (data: ProcessPaymentInput) =>
        apiPost<Payment>('/payments', data),

    getReceipt: (paymentId: string) =>
        apiGet<PaymentReceipt>(`/payments/${paymentId}/receipt`),
};
