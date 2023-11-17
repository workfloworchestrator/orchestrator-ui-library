import process from 'process';
import {
    Environment,
    OrchestratorConfig,
    getNumberValueFromEnvironmentVariable,
} from '@orchestrator-ui/orchestrator-ui-components';
import { SurfConfig } from '../contexts/surfConfigContext';

export const DEFAULT_GRAPHQL_CORE_ENDPOINT =
    'http://localhost:8080/api/graphql';
export const DEFAULT_ORCHESTRATOR_API_BASE_URL = 'http://localhost:8080/api';

export const ENGINE_STATUS_ENDPOINT = '/settings/status';
export const PROCESS_STATUS_COUNTS_ENDPOINT = '/processes/status-counts';
export const PROCESSES_ENDPOINT = '/processes';
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
        dataRefetchInterval: {
            processDetail: getNumberValueFromEnvironmentVariable(
                process.env.PROCESS_DETAIL_REFETCH_INTERVAL,
                PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL,
            ),
        },
        authActive: process.env.AUTH_ACTIVE?.toLowerCase() != 'false',
    };
};

const SURF_CIM_DEFAULT_SENDING_LEVEL = 'resilience_loss';

export const getInitialSurfConfig = (): SurfConfig => {
    const cimDefaultSendingLevel = process.env.SURF_CIM_DEFAULT_SENDING_LEVEL
        ? process.env.SURF_CIM_DEFAULT_SENDING_LEVEL
        : SURF_CIM_DEFAULT_SENDING_LEVEL;

    return {
        cimDefaultSendingLevel,
    };
};
