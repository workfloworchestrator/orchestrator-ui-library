import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { ApiClient, getApiClient } from '../api';
import { OrchestratorConfigContext } from './OrchestratorConfigContext';
import { DEFAULT_ORCHESTRATOR_API_BASE_URL } from '../configuration';

interface ApiContext {
    apiClient: ApiClient;
}

export const ApiClientContext = createContext<ApiContext>({
    apiClient: getApiClient(DEFAULT_ORCHESTRATOR_API_BASE_URL),
});

export type ApiClientContextProviderProps = {
    children: ReactNode;
};

export const ApiClientContextProvider = ({
    children,
}: ApiClientContextProviderProps) => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const apiClient = getApiClient(orchestratorApiBaseUrl);

    return (
        <ApiClientContext.Provider value={{ apiClient: apiClient }}>
            {children}
        </ApiClientContext.Provider>
    );
};
