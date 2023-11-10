import process from 'process';
import { Environment, OrchestratorConfig } from '../hooks';
import { getNumberValueFromEnvironmentVariable } from '../utils';

export const DEFAULT_GRAPHQL_CORE_ENDPOINT =
    'http://localhost:8080/api/graphql';
export const DEFAULT_ORCHESTRATOR_API_BASE_URL = 'http://localhost:8080/api';

export const ENGINE_STATUS_ENDPOINT = '/settings/status';
export const PROCESS_STATUS_COUNTS_ENDPOINT = '/processes/status-counts';
export const SUBSCRIPTION_ACTIONS_ENDPOINT = '/subscriptions/workflows';
export const SUBSCRIPTION_PROCESSES_ENDPOINT =
    '/processes/process-subscriptions-by-subscription-id';

export const PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL = 3000;

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
        processStatusCountsEndpoint:
            orchestratorApiBaseUrl + PROCESS_STATUS_COUNTS_ENDPOINT,
        graphqlEndpointCore: orchestratorGraphqlBaseUrl,
        environmentName:
            process.env.ENVIRONMENT_NAME ?? Environment.DEVELOPMENT,
        subscriptionActionsEndpoint:
            orchestratorApiBaseUrl + SUBSCRIPTION_ACTIONS_ENDPOINT,
        subscriptionProcessesEndpoint:
            orchestratorApiBaseUrl + SUBSCRIPTION_PROCESSES_ENDPOINT,
        dataRefetchInterval: {
            processDetail: getNumberValueFromEnvironmentVariable(
                process.env.PROCESS_DETAIL_REFETCH_INTERVAL,
                PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL,
            ),
        },
        authActive: process.env.AUTH_ACTIVE?.toLowerCase() != 'false',
    };
};
