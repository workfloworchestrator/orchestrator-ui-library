import { useState } from 'react';

export enum Environment {
    DEVELOPMENT = 'Development',
    PRODUCTION = 'Production',
}

export type OrchestratorConfig = {
    environmentName: Environment | string;
    engineStatusEndpoint: string;
    processStatusCountsEndpoint: string;
};

export const useOrchestratorConfig = (
    initialOrchestratorConfig: OrchestratorConfig,
) => {
    const [orchestratorConfig] = useState(initialOrchestratorConfig);

    return {
        orchestratorConfig,
    };
};
