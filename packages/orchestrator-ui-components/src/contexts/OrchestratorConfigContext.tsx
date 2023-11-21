import React from 'react';
import { FC, ReactNode, createContext } from 'react';

import {
    OrchestratorConfig,
    useOrchestratorConfig,
} from '../hooks/useOrchestratorConfig';

export const OrchestratorConfigContext = createContext<OrchestratorConfig>({
    environmentName: '',
    engineStatusEndpoint: '',
    graphqlEndpointCore: '',
    orchestratorApiBaseUrl: '',
    processStatusCountsEndpoint: '',
    processesEndpoint: '',
    subscriptionActionsEndpoint: '',
    subscriptionProcessesEndpoint: '',
    dataRefetchInterval: {
        processDetail: 0,
    },
    authActive: true,
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
