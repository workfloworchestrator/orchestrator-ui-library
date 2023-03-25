import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import { EuiProvider } from '@elastic/eui';
import {
    defaultOrchestratorTheme,
    Environment,
    OrchestratorConfig,
    OrchestratorConfigProvider,
    OrchestratorPageTemplate,
} from '@orchestrator-ui/orchestrator-ui-components';
import '@elastic/eui/dist/eui_theme_light.min.css';
import { getAppLogo } from '../components/AppLogo/AppLogo';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    ENGINE_STATUS_ENDPOINT,
    PROCESS_STATUS_COUNTS_ENDPOINT,
} from '../constants';
import { NextAdapter } from 'next-query-params';
import { QueryParamProvider } from 'use-query-params';
import { useRouter } from 'next/router';
import * as process from 'process';

const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 60 * 1000,
            cacheTime: 5 * 60 * 60 * 1000,
            refetchOnWindowFocus: true,
        },
    },
};

const initialOrchestratorConfig: OrchestratorConfig = {
    engineStatusEndpoint: ENGINE_STATUS_ENDPOINT,
    processStatusCountsEndpoint: PROCESS_STATUS_COUNTS_ENDPOINT,
    environmentName:
        process.env.NEXT_PUBLIC_ENVIRONMENT_NAME ?? Environment.DEVELOPMENT,
};

function CustomApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));
    const router = useRouter();

    return (
        <EuiProvider colorMode="light" modify={defaultOrchestratorTheme}>
            <Head>
                <title>Welcome to example-orchestrator-ui!</title>
            </Head>
            <main className="app">
                <OrchestratorConfigProvider
                    initialOrchestratorConfig={initialOrchestratorConfig}
                >
                    <QueryClientProvider client={queryClient}>
                        <OrchestratorPageTemplate
                            getAppLogo={getAppLogo}
                            routeTo={router.push}
                        >
                            <QueryParamProvider
                                adapter={NextAdapter}
                                options={{ removeDefaultsFromUrl: false }}
                            >
                                <Component {...pageProps} />
                            </QueryParamProvider>
                        </OrchestratorPageTemplate>
                    </QueryClientProvider>
                </OrchestratorConfigProvider>
            </main>
        </EuiProvider>
    );
}

export default CustomApp;
