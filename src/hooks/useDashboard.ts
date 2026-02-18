import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { dashboardClient } from '../services/dashboard.client';

export function useDashboardSummary() {
    return useQuery({
        queryKey: queryKeys.dashboard.summary(),
        queryFn: dashboardClient.getSummary,
    });
}

export function useDashboardQueue() {
    return useQuery({
        queryKey: queryKeys.dashboard.queue(),
        queryFn: dashboardClient.getQueue,
    });
}
