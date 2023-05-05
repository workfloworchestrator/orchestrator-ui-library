import { createContext, FC, ReactNode } from 'react';
import {
    OrchestratorConfig,
    useOrchestratorConfig,
} from '../hooks/useOrchestratorConfig';

export const OrchestratorConfigContext = createContext<OrchestratorConfig>({
    orchestratorApiBaseUrl: '',
    engineStatusEndpoint: '',
    processStatusCountsEndpoint: '',
    environmentName: '',
    graphqlEndpoint: '',
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
