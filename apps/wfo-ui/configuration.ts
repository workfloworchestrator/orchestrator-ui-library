import process from 'process';
import {
    Environment,
    getNumberValueFromEnvironmentVariable,
    OrchestratorConfig,
} from '@orchestrator-ui/orchestrator-ui-components';

export const GRAPHQL_ENDPOINT_CORE = 'http://localhost:8080/api/graphql';
export const ORCHESTRATOR_API_BASE_URL = 'http://localhost:8080/api';

export const ENGINE_STATUS_ENDPOINT = '/settings/status';
export const PROCESS_STATUS_COUNTS_ENDPOINT = '/processes/status-counts';
export const SUBSCRIPTION_ACTIONS_ENDPOINT = '/subscriptions/workflows';
export const SUBSCRIPTION_PROCESSES_ENDPOINT =
    '/processes/process-subscriptions-by-subscription-id';

export const PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL = 3000;

export const orchestratorApiBaseUrl =
    process.env.NEXT_PUBLIC_ORCHESTRATOR_API_HOST &&
    process.env.NEXT_PUBLIC_ORCHESTRATOR_API_PATH
        ? `${process.env.NEXT_PUBLIC_ORCHESTRATOR_API_HOST}${process.env.NEXT_PUBLIC_ORCHESTRATOR_API_PATH}`
        : ORCHESTRATOR_API_BASE_URL;

export const orchestratorGraphqlBaseUrl =
    process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_HOST &&
    process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_PATH
        ? `${process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_HOST}${process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_PATH}`
        : GRAPHQL_ENDPOINT_CORE;

export const initialOrchestratorConfig: OrchestratorConfig = {
    orchestratorApiBaseUrl,
    engineStatusEndpoint: orchestratorApiBaseUrl + ENGINE_STATUS_ENDPOINT,
    processStatusCountsEndpoint:
        orchestratorApiBaseUrl + PROCESS_STATUS_COUNTS_ENDPOINT,
    graphqlEndpointCore: orchestratorGraphqlBaseUrl,
    environmentName:
        process.env.NEXT_PUBLIC_ENVIRONMENT_NAME ?? Environment.DEVELOPMENT,
    subscriptionActionsEndpoint:
        orchestratorApiBaseUrl + SUBSCRIPTION_ACTIONS_ENDPOINT,
    subscriptionProcessesEndpoint:
        orchestratorApiBaseUrl + SUBSCRIPTION_PROCESSES_ENDPOINT,
    dataRefetchInterval: {
        processDetail: getNumberValueFromEnvironmentVariable(
            process.env.NEXT_PUBLIC_PROCESS_DETAIL_REFETCH_INTERVAL,
            PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL,
        ),
    },
};
