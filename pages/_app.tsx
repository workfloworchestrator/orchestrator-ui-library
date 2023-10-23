import React, { useState } from 'react';
import { AppProps } from 'next/app';

import Head from 'next/head';
import { EuiProvider, EuiSideNavItemType } from '@elastic/eui';
import {
    ApiClientContextProvider,
    defaultOrchestratorTheme,
    Environment,
    getNumberValueFromEnvironmentVariable,
    OrchestratorConfig,
    OrchestratorConfigProvider,
    ToastsContextProvider,
    ToastsList,
    WFOPageTemplate,
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
import { useRouter } from 'next/router';

const PATH_SURF = '/surf';

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

const initialOrchestratorConfig: OrchestratorConfig = {
    orchestratorApiBaseUrl: ORCHESTRATOR_API_BASE_URL,
    engineStatusEndpoint: ENGINE_STATUS_ENDPOINT,
    processStatusCountsEndpoint: PROCESS_STATUS_COUNTS_ENDPOINT,
    graphqlEndpointCore: GRAPHQL_ENDPOINT_CORE,
    environmentName:
        process.env.NEXT_PUBLIC_ENVIRONMENT_NAME ?? Environment.DEVELOPMENT,
    subscriptionActionsEndpoint: SUBSCRIPTION_ACTIONS_ENDPOINT,
    subscriptionProcessesEndpoint: SUBSCRIPTION_PROCESSES_ENDPOINT,
    dataRefetchInterval: {
        processDetail: getNumberValueFromEnvironmentVariable(
            process.env.NEXT_PUBLIC_PROCESS_DETAIL_REFETCH_INTERVAL,
            PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL,
        ),
    },
};

function CustomApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));

    const getMenuItems = (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ): EuiSideNavItemType<object>[] => [
        ...defaultMenuItems,
        {
            name: 'Surf',
            isSelected: router.pathname === PATH_SURF,
            id: '8',
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_SURF);
            },
        },
    ];

    return (
        <NoSSR>
            <TranslationsProvider>
                <EuiProvider
                    colorMode="light"
                    modify={defaultOrchestratorTheme}
                >
                    <ApiClientContextProvider
                        basePath={ORCHESTRATOR_API_BASE_URL}
                    >
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
                                        <WFOPageTemplate
                                            getAppLogo={getAppLogo}
                                            overrideMenuItems={getMenuItems}
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
                                        </WFOPageTemplate>
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
