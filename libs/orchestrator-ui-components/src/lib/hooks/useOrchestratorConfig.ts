import { useState } from 'react';

export type OrchestratorConfig = {
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
