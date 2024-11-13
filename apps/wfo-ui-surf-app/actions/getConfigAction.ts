'use server';

import { OrchestratorConfig } from '../contexts/ConfigContext';
import { getEnvironmentVariables } from '../utils/getEnvironmentVariables';

export async function getConfigAction() {
    const { ENVIRONMENT_NAME, ORCHESTRATOR_API_HOST, ORCHESTRATOR_API_PATH } =
        getEnvironmentVariables([
            'ENVIRONMENT_NAME',
            'ORCHESTRATOR_API_HOST',
            'ORCHESTRATOR_API_PATH',
        ]);

    const initialOrchestratorConfig: OrchestratorConfig = {
        environmentName: ENVIRONMENT_NAME,
        orchestratorApiBaseUrl: `${ORCHESTRATOR_API_HOST}${ORCHESTRATOR_API_PATH}`,
    };

    return initialOrchestratorConfig;
}
