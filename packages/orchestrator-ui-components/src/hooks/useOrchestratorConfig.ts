import { OrchestratorConfig } from '@/types';

export const useOrchestratorConfig = (
    initialOrchestratorConfig: OrchestratorConfig,
) => {
    return { orchestratorConfig: initialOrchestratorConfig };
};
