import React, { useState } from 'react';
import { AppProps } from 'next/app';

import Head from 'next/head';
import { EuiProvider } from '@elastic/eui';
import {
    ApiClientContextProvider,
    defaultOrchestratorTheme,
    Environment,
    getNumberValueFromEnvironmentVariable,
    OrchestratorConfig,
    OrchestratorConfigProvider,
    ToastsContextProvider,
    ToastsList,
    WfoPageTemplate,
} from '@orchestrator-ui/orchestrator-ui-components';

import '@elastic/eui/dist/eui_theme_light.min.css';
import { getAppLogo } from '../components/AppLogo/AppLogo';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    ENGINE_STATUS_ENDPOINT,
    GRAPHQL_ENDPOINT_CORE,
    ORCHESTRATOR_API_BASE_URL,
    PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL,
    PROCESS_STATUS_COUNTS_ENDPOINT,
    SUBSCRIPTION_ACTIONS_ENDPOINT,
    SUBSCRIPTION_PROCESSES_ENDPOINT,
} from '../constants';
import { NextAdapter } from 'next-query-params';
import { QueryParamProvider } from 'use-query-params';
import * as process from 'process';
import { QueryClientConfig } from 'react-query/types/core/types';
import { ReactQueryDevtools } from 'react-query/devtools';
import { TranslationsProvider } from '../translations/translationsProvider';
import NoSSR from 'react-no-ssr';

const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 60 * 1000,
            cacheTime: 5 * 60 * 60 * 1000,
            refetchOnWindowFocus: true,
            keepPreviousData: true,
        },
    },
};

const orchestratorApiBaseUrl =
    process.env.NEXT_PUBLIC_ORCHESTRATOR_API_HOST &&
    process.env.NEXT_PUBLIC_ORCHESTRATOR_API_PATH
        ? `${process.env.NEXT_PUBLIC_ORCHESTRATOR_API_HOST}${process.env.NEXT_PUBLIC_ORCHESTRATOR_API_PATH}`
        : ORCHESTRATOR_API_BASE_URL;

const orchestratorGraphqlBaseUrl =
    process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_HOST &&
    process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_PATH
        ? `${process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_HOST}${process.env.NEXT_PUBLIC_ORCHESTRATOR_GRAPHQL_PATH}`
        : GRAPHQL_ENDPOINT_CORE;

const initialOrchestratorConfig: OrchestratorConfig = {
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

function CustomApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));

    return (
        <NoSSR>
            <TranslationsProvider>
                <EuiProvider
                    colorMode="light"
                    modify={defaultOrchestratorTheme}
                >
                    <ApiClientContextProvider basePath={orchestratorApiBaseUrl}>
                        <Head>
                            <title>Welcome to example-orchestrator-ui!</title>
                        </Head>
                        <main className="app">
                            <OrchestratorConfigProvider
                                initialOrchestratorConfig={
                                    initialOrchestratorConfig
                                }
                            >
                                <QueryClientProvider
                                    client={queryClient}
                                    contextSharing={true}
                                >
                                    <ToastsContextProvider>
                                        <WfoPageTemplate
                                            getAppLogo={getAppLogo}
                                        >
                                            <QueryParamProvider
                                                adapter={NextAdapter}
                                                options={{
                                                    removeDefaultsFromUrl:
                                                        false,
                                                    enableBatching: true,
                                                }}
                                            >
                                                <Component {...pageProps} />
                                            </QueryParamProvider>
                                        </WfoPageTemplate>
                                        <ToastsList />
                                    </ToastsContextProvider>
                                    <ReactQueryDevtools initialIsOpen={false} />
                                </QueryClientProvider>
                            </OrchestratorConfigProvider>
                        </main>{' '}
                    </ApiClientContextProvider>
                </EuiProvider>
            </TranslationsProvider>
        </NoSSR>
    );
}

export default CustomApp;
