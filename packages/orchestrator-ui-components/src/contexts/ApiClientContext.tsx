import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import { OrchestratorConfigContext } from './OrchestratorConfigContext';
import { ApiClient, getApiClient } from '../api';

interface ApiContext {
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
    const apiClient = getApiClient(orchestratorApiBaseUrl);

    return (
        <ApiClientContext.Provider value={{ apiClient: apiClient }}>
            {children}
        </ApiClientContext.Provider>
    );
};
