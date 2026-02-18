import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { analyticsClient } from '../services/analytics.client';

export function useRevenue(start: string, end: string) {
    return useQuery({
        queryKey: queryKeys.analytics.revenue(start, end),
        queryFn: () => analyticsClient.getRevenue(start, end),
        enabled: !!start && !!end,
    });
}

export function useDailyIncome(start: string, end: string) {
    return useQuery({
        queryKey: queryKeys.analytics.dailyIncome(start, end),
        queryFn: () => analyticsClient.getDailyIncome(start, end),
        enabled: !!start && !!end,
    });
}

export function useCommissions(start: string, end: string) {
    return useQuery({
        queryKey: queryKeys.analytics.commissions(start, end),
        queryFn: () => analyticsClient.getCommissions(start, end),
        enabled: !!start && !!end,
    });
}
