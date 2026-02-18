import { apiGet } from '../lib/api-fetch';
import type { DashboardSummary, QueueItem } from '../lib/types';

export const dashboardClient = {
    getSummary: () =>
        apiGet<DashboardSummary>('/dashboard/summary'),

    getQueue: () =>
        apiGet<QueueItem[]>('/dashboard/queue'),
};
