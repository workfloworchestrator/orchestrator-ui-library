import { createContext, FC, ReactNode } from 'react';
import {
    OrchestratorConfig,
    useOrchestratorConfig,
} from '../hooks/useOrchestratorConfig';

export const OrchestratorConfigContext = createContext<OrchestratorConfig>({
    engineStatusEndpoint: '',
    environmentName: '',
    graphqlEndpointPythia: '',
    graphqlEndpointCore: '',
    orchestratorApiBaseUrl: '',
    processStatusCountsEndpoint: '',
    subscriptionActionsEndpoint: '',
    subscriptionProcessesEndpoint: '',
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
