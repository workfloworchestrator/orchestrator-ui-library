import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import { ApiClient, getApiClient } from '@/api';
import { useWfoSession } from '@/hooks';

import { OrchestratorConfigContext } from './OrchestratorConfigContext';

export interface ApiContext {
    apiClient: ApiClient;
}

export const ApiClientContext = createContext<ApiContext>({
    apiClient: getApiClient(''),
});

export type ApiClientContextProviderProps = {
    children: ReactNode;
};

export const ApiClientContextProvider = ({
    children,
}: ApiClientContextProviderProps) => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const { session } = useWfoSession();
    const accessToken = session?.accessToken;
    const apiClient = getApiClient(orchestratorApiBaseUrl, accessToken);

    return (
        <ApiClientContext.Provider value={{ apiClient: apiClient }}>
            {children}
        </ApiClientContext.Provider>
    );
};
