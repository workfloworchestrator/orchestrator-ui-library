import React from 'react';
import { FC, ReactNode, createContext } from 'react';

import { useOrchestratorConfig } from '@/hooks/useOrchestratorConfig';
import type { OrchestratorConfig } from '@/types';

export const emptyOrchestratorConfig: OrchestratorConfig = {
    environmentName: '',
    graphqlEndpointCore: '',
    orchestratorApiBaseUrl: '',
    orchestratorWebsocketUrl: '',
    authActive: true,
    useWebSockets: false,
    useThemeToggle: false,
    showWorkflowInformationLink: false,
    workflowInformationLinkUrl: '',
    enableSupportMenuItem: false,
    supportMenuItemUrl: '',
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
    const { orchestratorConfig } = useOrchestratorConfig(
        initialOrchestratorConfig ?? emptyOrchestratorConfig,
    );

    return (
        <OrchestratorConfigContext.Provider value={orchestratorConfig}>
            {children}
        </OrchestratorConfigContext.Provider>
    );
};
