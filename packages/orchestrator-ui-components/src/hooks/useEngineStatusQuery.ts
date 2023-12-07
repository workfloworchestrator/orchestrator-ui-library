import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { OrchestratorConfigContext } from '@/contexts';
import { EngineStatus } from '@/types';

import { useQueryWithFetch } from './useQueryWithFetch';
import { useSessionWithToken } from './useSessionWithToken';

export interface EngineStatusReturnValue {
    global_lock: boolean;
    running_processes: number;
    global_status: EngineStatus;
}

interface EngineStatusPayload {
    global_lock: boolean;
}

export const useEngineStatusQuery = () => {
    const { engineStatusEndpoint } = useContext(OrchestratorConfigContext);

    return useQueryWithFetch<EngineStatusReturnValue, Record<string, never>>(
        engineStatusEndpoint,
        {},
        'engineStatus',
    );
};

export const useEngineStatusMutation = () => {
    const { engineStatusEndpoint } = useContext(OrchestratorConfigContext);
    const queryClient = useQueryClient();
    const { session } = useSessionWithToken();
    let requestHeaders = {};

    if (session) {
        const { accessToken } = session;

        requestHeaders = {
            Authorization: `Bearer ${accessToken}`,
        };
    }

    const setEngineStatus = async (data: EngineStatusPayload) => {
        const response = await fetch(engineStatusEndpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...requestHeaders,
            },
        });
        return (await response.json()) as EngineStatusReturnValue;
    };

    return useMutation('engineStatus', setEngineStatus, {
        onMutate: () => {
            queryClient.setQueryData(['engineStatus'], null); // Set loading state of the button
        },
        onSuccess: (data: EngineStatusReturnValue) => {
            queryClient.setQueryData(['engineStatus'], data); // Set global status
        },
    });
};
