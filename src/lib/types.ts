/**
 * Shared types for the SukimSalon POS frontend.
 * Mirrors backend database schema types.
 */

// ─── Auth ────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'manager' | 'cashier' | 'stylist';

export interface AuthUser {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
}

export interface LoginResponse {
    session: {
        access_token: string;
        refresh_token: string;
    };
    user: AuthUser;
}

// ─── Customers ───────────────────────────────────────────────────────

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Customer {
    id: string;
    display_id: string;
    name: string;
    phone: string | null;
    email: string | null;
    date_of_birth: string | null;
    avatar_url: string | null;
    loyalty_tier: LoyaltyTier;
    loyalty_points: number;
    total_visits: number;
    total_spent: number;
    member_since: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CustomerNote {
    id: string;
    customer_id: string;
    note: string;
    created_by: string | null;
    created_at: string;
}

// ─── Stylists ────────────────────────────────────────────────────────

export interface Stylist {
    id: string;
    user_id: string | null;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    avatar_url: string | null;
    commission_rate: number;
    is_available: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ─── Services ────────────────────────────────────────────────────────

export interface ServiceCategory {
    id: string;
    name: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Service {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: number;
    duration_minutes: number;
    icon: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    service_categories?: ServiceCategory;
}

// ─── Products ────────────────────────────────────────────────────────

export interface ProductCategory {
    id: string;
    name: string;
    type: 'retail' | 'internal';
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Product {
    id: string;
    category_id: string;
    name: string;
    sku: string;
    description: string | null;
    buy_price: number;
    sell_price: number;
    stock_qty: number;
    reserved_qty: number;
    min_stock_qty: number;
    unit: string;
    image_url: string | null;
    version: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    product_categories?: ProductCategory;
}

// ─── Reservations ────────────────────────────────────────────────────

export type ReservationType = 'booking' | 'walk_in';
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';

export interface Reservation {
    id: string;
    customer_id: string | null;
    stylist_id: string | null;
    type: ReservationType;
    status: ReservationStatus;
    scheduled_at: string;
    estimated_duration_min: number;
    checked_in_at: string | null;
    completed_at: string | null;
    notes: string | null;
    version: number;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    customers?: Customer;
    stylists?: Stylist;
    reservation_services?: Array<{ service_id: string; services: Service }>;
}

// ─── Orders ──────────────────────────────────────────────────────────

export type OrderStatus = 'active' | 'held' | 'completed' | 'cancelled';
export type OrderItemType = 'service' | 'product' | 'package' | 'addon';

export interface OrderItem {
    id: string;
    order_id: string;
    item_type: OrderItemType;
    service_id: string | null;
    product_id: string | null;
    name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
    stylist_id: string | null;
    created_at: string;
}

export interface Order {
    id: string;
    order_number: string;
    reservation_id: string | null;
    customer_id: string | null;
    stylist_id: string | null;
    cashier_id: string | null;
    status: OrderStatus;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    discount_amount: number;
    discount_type: 'flat' | 'percentage' | 'member' | null;
    total: number;
    idempotency_key: string | null;
    version: number;
    started_at: string;
    completed_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[];
    customers?: Customer;
    stylists?: Stylist;
}

// ─── Payments ────────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'card' | 'qris' | 'debit';
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'refunded';

export interface Payment {
    id: string;
    order_id: string;
    idempotency_key: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount_due: number;
    amount_paid: number;
    change_amount: number;
    gateway_ref: string | null;
    member_discount_applied: boolean;
    loyalty_points_earned: number;
    receipt_url: string | null;
    notes: string | null;
    processed_by: string | null;
    processed_at: string;
    created_at: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────

export interface DashboardSummary {
    daily_revenue: number;
    total_customers: number;
    walk_ins: number;
    booked: number;
    services_done: number;
    low_stock_count: number;
}

export interface QueueItem {
    id: string;
    order_number: string;
    status: string;
    started_at: string;
    customers: { name: string; avatar_url: string | null } | null;
    stylists: { name: string } | null;
    order_items: Array<{ name: string }>;
}

// ─── Analytics ───────────────────────────────────────────────────────

export interface RevenueData {
    total: number;
    trend_percent: number;
    period_start: string;
    period_end: string;
}

export interface DailyIncome {
    date: string;
    total: number;
    order_count: number;
}

export interface StylistCommission {
    stylist_id: string;
    name: string;
    total_revenue: number;
    commission_amount: number;
    service_count: number;
}

// ─── Settings ────────────────────────────────────────────────────────

export interface SalonSettings {
    id: string;
    salon_name: string;
    tax_rate: number;
    currency: string;
    opening_time: string;
    closing_time: string;
    loyalty_points_per_transaction: number;
    loyalty_tier_thresholds: Record<string, number>;
    member_discount_rate: number;
    updated_at: string;
}

// ─── API Utility Types ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface ApiErrorResponse {
    error: string;
    errorCode: string;
    details?: Record<string, unknown>;
}

export interface PaymentResult extends Payment {
    snap_token?: string | null;
    actions?: Array<{ name: string; method: string; url: string }>;
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
