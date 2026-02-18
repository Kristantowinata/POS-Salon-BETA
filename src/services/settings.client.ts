import { apiGet, apiPatch } from '../lib/api-fetch';
import type { SalonSettings } from '../lib/types';

export type UpdateSettingsInput = Partial<Omit<SalonSettings, 'id' | 'updated_at'>>;

export const settingsClient = {
    get: () =>
        apiGet<SalonSettings>('/settings'),

    update: (data: UpdateSettingsInput) =>
        apiPatch<SalonSettings>('/settings', data),
};
