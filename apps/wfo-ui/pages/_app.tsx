import React, { useState } from 'react';
import { AppProps } from 'next/app';

import Head from 'next/head';
import { EuiProvider } from '@elastic/eui';
import {
    ApiClientContextProvider,
    defaultOrchestratorTheme,
    OrchestratorConfigProvider,
    ToastsContextProvider,
    ToastsList,
    WfoPageTemplate,
} from '@orchestrator-ui/orchestrator-ui-components';

import '@elastic/eui/dist/eui_theme_light.min.css';
import { getAppLogo } from '../components/AppLogo/AppLogo';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    initialOrchestratorConfig,
    orchestratorApiBaseUrl,
} from '../configuration';
import { NextAdapter } from 'next-query-params';
import { QueryParamProvider } from 'use-query-params';
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
