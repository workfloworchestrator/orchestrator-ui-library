import process from 'process';

import {
    Environment,
    OrchestratorConfig,
} from '@orchestrator-ui/orchestrator-ui-components';

export const DEFAULT_GRAPHQL_CORE_ENDPOINT =
    'http://localhost:8080/api/graphql';
export const DEFAULT_ORCHESTRATOR_API_BASE_URL = 'http://localhost:8080/api';

export const ENGINE_STATUS_ENDPOINT = '/settings/status';
export const PROCESS_STATUS_COUNTS_ENDPOINT = '/processes/status-counts';
export const PROCESSES_ENDPOINT = '/processes';
export const SUBSCRIPTION_ACTIONS_ENDPOINT = '/subscriptions/workflows';
export const SUBSCRIPTION_PROCESSES_ENDPOINT =
    '/processes/process-subscriptions-by-subscription-id';

export const getInitialOrchestratorConfig = (): OrchestratorConfig => {
    const orchestratorGraphqlBaseUrl =
        process.env.ORCHESTRATOR_GRAPHQL_HOST &&
        process.env.ORCHESTRATOR_GRAPHQL_PATH
            ? `${process.env.ORCHESTRATOR_GRAPHQL_HOST}${process.env.ORCHESTRATOR_GRAPHQL_PATH}`
            : DEFAULT_GRAPHQL_CORE_ENDPOINT;

    const orchestratorApiBaseUrl =
        process.env.ORCHESTRATOR_API_HOST && process.env.ORCHESTRATOR_API_PATH
            ? `${process.env.ORCHESTRATOR_API_HOST}${process.env.ORCHESTRATOR_API_PATH}`
            : DEFAULT_ORCHESTRATOR_API_BASE_URL;

    return {
        orchestratorApiBaseUrl,
        engineStatusEndpoint: orchestratorApiBaseUrl + ENGINE_STATUS_ENDPOINT,
        graphqlEndpointCore: orchestratorGraphqlBaseUrl,
        processStatusCountsEndpoint:
            orchestratorApiBaseUrl + PROCESS_STATUS_COUNTS_ENDPOINT,
        processesEndpoint: orchestratorApiBaseUrl + PROCESSES_ENDPOINT,
        environmentName:
            process.env.ENVIRONMENT_NAME ?? Environment.DEVELOPMENT,
        subscriptionActionsEndpoint:
            orchestratorApiBaseUrl + SUBSCRIPTION_ACTIONS_ENDPOINT,
        subscriptionProcessesEndpoint:
            orchestratorApiBaseUrl + SUBSCRIPTION_PROCESSES_ENDPOINT,
        authActive: process.env.AUTH_ACTIVE?.toLowerCase() != 'false',
    };
};
