'use client';

import { FC, ReactNode, createContext } from 'react';

export type OrchestratorConfig = {
    environmentName: string;
    orchestratorApiBaseUrl: string;
};

export const emptyOrchestratorConfig: OrchestratorConfig = {
    environmentName: '',
    orchestratorApiBaseUrl: '',
};

export const OrchestratorConfigContext = createContext<OrchestratorConfig>(
    emptyOrchestratorConfig,
);

export type OrchestratorConfigProviderProps = {
    initialOrchestratorConfig: OrchestratorConfig | null;
    children: ReactNode;
};

export const OrchestratorConfigProvider: FC<
    OrchestratorConfigProviderProps
> = ({ initialOrchestratorConfig, children }) => {
    return (
        <OrchestratorConfigContext.Provider
            value={initialOrchestratorConfig ?? emptyOrchestratorConfig}
        >
            {children}
        </OrchestratorConfigContext.Provider>
    );
};
