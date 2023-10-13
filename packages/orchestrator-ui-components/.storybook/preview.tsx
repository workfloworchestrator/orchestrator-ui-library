import { useState } from 'react';
import { Preview } from '@storybook/react';
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
} from '../src';
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.min.css';
import {
    ENGINE_STATUS_ENDPOINT,
    GRAPHQL_ENDPOINT_CORE,
    ORCHESTRATOR_API_BASE_URL,
    PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL,
    PROCESS_STATUS_COUNTS_ENDPOINT,
    SUBSCRIPTION_ACTIONS_ENDPOINT,
    SUBSCRIPTION_PROCESSES_ENDPOINT,
} from 'wfo-ui/constants';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { QueryParamProvider } from 'use-query-params';
import { NextAdapter } from 'next-query-params';
import { ReactQueryDevtools } from 'react-query/devtools';
import { TranslationsProvider } from 'wfo-ui/translations/translationsProvider';
import { QueryClientConfig } from 'react-query/types/core/types';
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

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        (Story) => {
            const [queryClient] = useState(
                () => new QueryClient(queryClientConfig),
            );
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
                                    <title>
                                        Welcome to example-orchestrator-ui!
                                    </title>
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
                                                <QueryParamProvider
                                                    adapter={NextAdapter}
                                                    options={{
                                                        removeDefaultsFromUrl:
                                                            false,
                                                        enableBatching: true,
                                                    }}
                                                >
                                                    <Story />
                                                </QueryParamProvider>
                                                <ToastsList />
                                            </ToastsContextProvider>
                                            <ReactQueryDevtools
                                                initialIsOpen={false}
                                            />
                                        </QueryClientProvider>
                                    </OrchestratorConfigProvider>
                                </main>{' '}
                            </ApiClientContextProvider>
                        </EuiProvider>
                    </TranslationsProvider>
                </NoSSR>
            );
        },
    ],
};

export default preview;
