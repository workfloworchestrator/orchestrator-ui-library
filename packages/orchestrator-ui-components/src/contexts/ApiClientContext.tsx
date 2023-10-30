import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ApiClient, getApiClient } from '../api';

interface ApiContext {
    apiClient: ApiClient;
}

// Todo replace this magic string when configuration.ts is moved to package
export const ApiClientContext = createContext<ApiContext>({
    apiClient: getApiClient('http://localhost:8080/api'),
});

export type ApiClientContextProviderProps = {
    basePath: string;
    children: ReactNode;
};

export const ApiClientContextProvider = ({
    basePath,
    children,
}: ApiClientContextProviderProps) => {
    const [apiPath, setApiPath] = useState<string>(basePath);
    const apiClient = getApiClient(apiPath);

    useEffect(() => {
        if (basePath) {
            setApiPath(basePath);
        }
    }, [basePath]);

    return (
        <ApiClientContext.Provider value={{ apiClient: apiClient }}>
            {children}
        </ApiClientContext.Provider>
    );
};
