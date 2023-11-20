import { useState } from 'react';

export enum Environment {
    DEVELOPMENT = 'Development',
    PRODUCTION = 'Production',
}

export type OrchestratorConfig = {
    environmentName: Environment | string;
    orchestratorApiBaseUrl: string;
    graphqlEndpointCore: string;
    engineStatusEndpoint: string;
    processStatusCountsEndpoint: string;
    processesEndpoint: string;
    subscriptionActionsEndpoint: string;
    subscriptionProcessesEndpoint: string;
    dataRefetchInterval: {
        processDetail: number;
    };
    authActive: boolean;
};

export const useOrchestratorConfig = (
    initialOrchestratorConfig: OrchestratorConfig,
) => {
    const [orchestratorConfig] = useState(initialOrchestratorConfig);

    return {
        orchestratorConfig,
    };
};
