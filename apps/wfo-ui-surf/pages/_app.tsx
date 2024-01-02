import React, { useState } from 'react';
import NoSSR from 'react-no-ssr';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientConfig } from 'react-query/types/core/types';

import { SessionProvider } from 'next-auth/react';
import { NextAdapter } from 'next-query-params';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { QueryParamProvider } from 'use-query-params';

import { EuiProvider, EuiSideNavItemType } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.min.css';
import {
    ApiClientContextProvider,
    ConfirmationDialogContextWrapper,
    OrchestratorConfig,
    OrchestratorConfigProvider,
    ToastsContextProvider,
    ToastsList,
    WfoAuth,
    WfoPageTemplate,
    defaultOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { getAppLogo } from '@/components/AppLogo/AppLogo';
import {
    getInitialOrchestratorConfig,
    getInitialSurfConfig,
} from '@/configuration';
import { PATH_SERVICE_TICKETS } from '@/constants-surf';
import { SurfConfig, SurfConfigProvider } from '@/contexts/SurfConfigContext';
import { TranslationsProvider } from '@/translations/translationsProvider';

import '../font/inter.css';

type AppOwnProps = {
    orchestratorConfig: OrchestratorConfig;
    surfConfig: SurfConfig;
};

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

function CustomApp({
    Component,
    pageProps,
    orchestratorConfig,
    surfConfig,
}: AppProps & AppOwnProps) {
    const router = useRouter();
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));

    const getMenuItems = (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ): EuiSideNavItemType<object>[] => [
        ...defaultMenuItems,
        {
            name: 'Service Tickets',
            id: '8',
            isSelected: router.pathname === PATH_SERVICE_TICKETS,
            href: PATH_SERVICE_TICKETS,
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_SERVICE_TICKETS);
            },
        },
    ];

    return (
        <OrchestratorConfigProvider
            initialOrchestratorConfig={orchestratorConfig}
        >
            <SurfConfigProvider initialOrchestratorConfig={surfConfig}>
                <SessionProvider session={pageProps.session}>
                    <WfoAuth>
                        <NoSSR>
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
                                                <ToastsContextProvider>
                                                    <ConfirmationDialogContextWrapper>
                                                        <WfoPageTemplate
                                                            getAppLogo={
                                                                getAppLogo
                                                            }
                                                            overrideMenuItems={
                                                                getMenuItems
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
                                                        <ToastsList />
                                                    </ConfirmationDialogContextWrapper>
                                                </ToastsContextProvider>
                                                <ReactQueryDevtools
                                                    initialIsOpen={false}
                                                />
                                            </main>
                                        </TranslationsProvider>
                                    </QueryClientProvider>
                                </ApiClientContextProvider>
                            </EuiProvider>
                        </NoSSR>
                    </WfoAuth>
                </SessionProvider>
            </SurfConfigProvider>
        </OrchestratorConfigProvider>
    );
}

CustomApp.getInitialProps = async (
    context: AppContext,
): Promise<AppOwnProps & AppInitialProps> => {
    const ctx = await App.getInitialProps(context);
    return {
        ...ctx,
        orchestratorConfig: getInitialOrchestratorConfig(),
        surfConfig: getInitialSurfConfig(),
    };
};

export default CustomApp;
