import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import { settingsClient, type UpdateSettingsInput } from '../services/settings.client';

export function useSettings() {
    return useQuery({
        queryKey: queryKeys.settings.all,
        queryFn: settingsClient.get,
    });
}

export function useUpdateSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateSettingsInput) => settingsClient.update(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.settings.all });
        },
    });
}
