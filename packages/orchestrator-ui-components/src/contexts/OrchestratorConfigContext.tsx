import React from 'react';
import { FC, ReactNode, createContext } from 'react';

import { useOrchestratorConfig } from '@/hooks/useOrchestratorConfig';
import type { OrchestratorConfig } from '@/types';

export const OrchestratorConfigContext = createContext<OrchestratorConfig>({
    environmentName: '',
    engineStatusEndpoint: '',
    graphqlEndpointCore: '',
    orchestratorApiBaseUrl: '',
    orchestratorWebsocketUrl: '',
    processesEndpoint: '',
    subscriptionProcessesEndpoint: '',
    authActive: true,
    useWebSockets: false,
    useThemeToggle: false,
    showWorkflowInformationLink: false,
    workflowInformationLinkUrl: '',
});

export type OrchestratorConfigProviderProps = {
    initialOrchestratorConfig: OrchestratorConfig;
    children: ReactNode;
};

export const OrchestratorConfigProvider: FC<
    OrchestratorConfigProviderProps
> = ({ initialOrchestratorConfig, children }) => {
    const { orchestratorConfig } = useOrchestratorConfig(
        initialOrchestratorConfig,
    );

    return (
        <OrchestratorConfigContext.Provider value={orchestratorConfig}>
            {children}
        </OrchestratorConfigContext.Provider>
    );
};
