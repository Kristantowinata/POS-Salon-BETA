/**
 * QueryClient configuration and query key factories.
 */

import { QueryClient } from '@tanstack/react-query';

// ─── Query Client ────────────────────────────────────────────────────

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000,        // 30 seconds
            gcTime: 5 * 60 * 1000,       // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

// ─── Query Key Factories ─────────────────────────────────────────────
// Type-safe query keys for invalidation and caching.

export const queryKeys = {
    // Dashboard
    dashboard: {
        all: ['dashboard'] as const,
        summary: () => [...queryKeys.dashboard.all, 'summary'] as const,
        queue: () => [...queryKeys.dashboard.all, 'queue'] as const,
    },

    // Services
    services: {
        all: ['services'] as const,
        list: () => [...queryKeys.services.all, 'list'] as const,
        detail: (id: string) => [...queryKeys.services.all, 'detail', id] as const,
    },

    // Orders
    orders: {
        all: ['orders'] as const,
        list: (filters?: object) => [...queryKeys.orders.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
    },

    // Reservations
    reservations: {
        all: ['reservations'] as const,
        list: (filters?: object) => [...queryKeys.reservations.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.reservations.all, 'detail', id] as const,
    },

    // Customers
    customers: {
        all: ['customers'] as const,
        list: (filters?: object) => [...queryKeys.customers.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
        history: (id: string) => [...queryKeys.customers.all, 'history', id] as const,
    },

    // Inventory / Products
    inventory: {
        all: ['inventory'] as const,
        list: (filters?: object) => [...queryKeys.inventory.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.inventory.all, 'detail', id] as const,
    },

    // Stylists
    stylists: {
        all: ['stylists'] as const,
        list: () => [...queryKeys.stylists.all, 'list'] as const,
        detail: (id: string) => [...queryKeys.stylists.all, 'detail', id] as const,
        availability: (id: string, date: string) => [...queryKeys.stylists.all, 'availability', id, date] as const,
    },

    // Payments
    payments: {
        all: ['payments'] as const,
        receipt: (id: string) => [...queryKeys.payments.all, 'receipt', id] as const,
    },

    // Analytics
    analytics: {
        all: ['analytics'] as const,
        revenue: (start: string, end: string) => [...queryKeys.analytics.all, 'revenue', start, end] as const,
        dailyIncome: (start: string, end: string) => [...queryKeys.analytics.all, 'daily-income', start, end] as const,
        commissions: (start: string, end: string) => [...queryKeys.analytics.all, 'commissions', start, end] as const,
    },

    // Settings
    settings: {
        all: ['settings'] as const,
    },
} as const;
