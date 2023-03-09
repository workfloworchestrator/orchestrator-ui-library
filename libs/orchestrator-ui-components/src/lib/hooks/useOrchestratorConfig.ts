import { useState } from 'react';

export type OrchestratorConfig = {
    engineStatusEndpoint: string;
};

export const useOrchestratorConfig = (
    initialOrchestratorConfig: OrchestratorConfig,
) => {
    const [orchestratorConfig] = useState(initialOrchestratorConfig);

    return {
        orchestratorConfig,
    };
};
