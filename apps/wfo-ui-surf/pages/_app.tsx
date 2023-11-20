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
    OrchestratorConfig,
    OrchestratorConfigProvider,
    ToastsContextProvider,
    ToastsList,
    WfoAuth,
    WfoPageTemplate,
    defaultOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { getAppLogo } from '../components/AppLogo/AppLogo';
import { getInitialOrchestratorConfig } from '../configuration';
import { PATH_SERVICE_TICKETS } from '../constants-surf';
import { TranslationsProvider } from '../translations/translationsProvider';

type AppOwnProps = { orchestratorConfig: OrchestratorConfig };

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
            <SessionProvider session={pageProps.session}>
                <WfoAuth>
                    <NoSSR>
                        <TranslationsProvider>
                            <EuiProvider
                                colorMode="light"
                                modify={defaultOrchestratorTheme}
                            >
                                <ApiClientContextProvider>
                                    <Head>
                                        <title>
                                            Welcome to example-orchestrator-ui!
                                        </title>
                                    </Head>
                                    <main className="app">
                                        <QueryClientProvider
                                            client={queryClient}
                                            contextSharing={true}
                                        >
                                            <ToastsContextProvider>
                                                <WfoPageTemplate
                                                    getAppLogo={getAppLogo}
                                                    overrideMenuItems={
                                                        getMenuItems
                                                    }
                                                >
                                                    <QueryParamProvider
                                                        adapter={NextAdapter}
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
                                            </ToastsContextProvider>
                                            <ReactQueryDevtools
                                                initialIsOpen={false}
                                            />
                                        </QueryClientProvider>
                                    </main>
                                </ApiClientContextProvider>
                            </EuiProvider>
                        </TranslationsProvider>
                    </NoSSR>
                </WfoAuth>
            </SessionProvider>
        </OrchestratorConfigProvider>
    );
}

CustomApp.getInitialProps = async (
    context: AppContext,
): Promise<AppOwnProps & AppInitialProps> => {
    const ctx = await App.getInitialProps(context);

    return { ...ctx, orchestratorConfig: getInitialOrchestratorConfig() };
};

export default CustomApp;
