import React, { useState } from 'react';
import NoSSR from 'react-no-ssr';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientConfig } from 'react-query/types/core/types';

import { SessionProvider } from 'next-auth/react';
import { NextAdapter } from 'next-query-params';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import Head from 'next/head';
import { QueryParamProvider } from 'use-query-params';

import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.min.css';
import {
    ApiClientContextProvider,
    ConfirmationDialogContextWrapper,
    OrchestratorConfig,
    OrchestratorConfigProvider,
    StoreProvider,
    WfoAuth,
    WfoErrorBoundary,
    WfoPageTemplate,
    WfoToastsList,
    defaultOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { getAppLogo } from '@/components/AppLogo/AppLogo';
import { getInitialOrchestratorConfig } from '@/configuration';
import { TranslationsProvider } from '@/translations/translationsProvider';

import '../font/inter.css';

type AppOwnProps = { orchestratorConfig: OrchestratorConfig };

const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            cacheTime: 5 * 1000,
            refetchOnWindowFocus: true,
        },
    },
};

function CustomApp({
    Component,
    pageProps,
    orchestratorConfig,
}: AppProps & AppOwnProps) {
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));

    return (
        <WfoErrorBoundary>
            <OrchestratorConfigProvider
                initialOrchestratorConfig={orchestratorConfig}
            >
                <StoreProvider initialOrchestratorConfig={orchestratorConfig}>
                    <SessionProvider session={pageProps.session}>
                        <NoSSR>
                            <WfoAuth>
                                <EuiProvider
                                    colorMode="light"
                                    modify={defaultOrchestratorTheme}
                                >
                                    <ApiClientContextProvider>
                                        <QueryClientProvider
                                            client={queryClient}
                                            contextSharing={true}
                                        >
                                            <TranslationsProvider>
                                                <Head>
                                                    <link
                                                        rel="icon"
                                                        href="/favicon.png"
                                                    />
                                                    <title>
                                                        Welcome to
                                                        example-orchestrator-ui!
                                                    </title>
                                                </Head>
                                                <main className="app">
                                                    <ConfirmationDialogContextWrapper>
                                                        <WfoPageTemplate
                                                            getAppLogo={
                                                                getAppLogo
                                                            }
                                                        >
                                                            <QueryParamProvider
                                                                adapter={
                                                                    NextAdapter
                                                                }
                                                                options={{
                                                                    removeDefaultsFromUrl:
                                                                        false,
                                                                    enableBatching:
                                                                        true,
                                                                }}
                                                            >
                                                                <Component
                                                                    {...pageProps}
                                                                />
                                                            </QueryParamProvider>
                                                        </WfoPageTemplate>
                                                        <WfoToastsList />
                                                    </ConfirmationDialogContextWrapper>
                                                    <ReactQueryDevtools
                                                        initialIsOpen={false}
                                                    />
                                                </main>
                                            </TranslationsProvider>
                                        </QueryClientProvider>
                                    </ApiClientContextProvider>
                                </EuiProvider>
                            </WfoAuth>
                        </NoSSR>
                    </SessionProvider>
                </StoreProvider>
            </OrchestratorConfigProvider>
        </WfoErrorBoundary>
    );
}

CustomApp.getInitialProps = async (
    context: AppContext,
): Promise<AppOwnProps & AppInitialProps> => {
    const ctx = await App.getInitialProps(context);

    return {
        ...ctx,
        orchestratorConfig: getInitialOrchestratorConfig(),
    };
};

export default CustomApp;
