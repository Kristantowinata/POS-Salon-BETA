import { apiPost } from '../lib/api-fetch';
import type { Order } from '../lib/types';

export interface CheckoutInput {
    idempotency_key: string;
    customer_id?: string;
    stylist_id?: string;
    reservation_id?: string;
    items: Array<{
        item_type: 'service' | 'product' | 'package' | 'addon';
        service_id?: string;
        product_id?: string;
        name: string;
        unit_price: number;
        quantity: number;
        stylist_id?: string;
    }>;
    discount_type?: 'flat' | 'percentage' | 'member';
    discount_amount?: number;
    tax_rate?: number;
    notes?: string;
}

export const checkoutClient = {
    create: (data: CheckoutInput) =>
        apiPost<Order>('/checkout', data),
};
