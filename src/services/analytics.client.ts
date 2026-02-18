import { apiGet } from '../lib/api-fetch';
import type { RevenueData, DailyIncome, StylistCommission } from '../lib/types';

export const analyticsClient = {
    getRevenue: (start: string, end: string) =>
        apiGet<RevenueData>(`/analytics/revenue?start=${start}&end=${end}`),

    getDailyIncome: (start: string, end: string) =>
        apiGet<DailyIncome[]>(`/analytics/daily-income?start=${start}&end=${end}`),

    getCommissions: (start: string, end: string) =>
        apiGet<StylistCommission[]>(`/analytics/commissions?start=${start}&end=${end}`),
};
