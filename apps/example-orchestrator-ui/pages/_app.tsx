import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import { EuiProvider } from '@elastic/eui';
import {
    defaultOrchestratorTheme,
    OrchestratorConfigProvider,
    OrchestratorPageTemplate,
    OrchestratorConfig,
} from '@orchestrator-ui/orchestrator-ui-components';
import '@elastic/eui/dist/eui_theme_light.min.css';
import { getAppLogo } from '../components/AppLogo/AppLogo';
import { QueryClient, QueryClientProvider } from 'react-query';
import { STATUS_ENDPOINT } from '../constants';

const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 60 * 1000,
            cacheTime: 5 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
};

const initialOrchestratorConfig: OrchestratorConfig = {
    engineStatusEndpoint: STATUS_ENDPOINT,
};

function CustomApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));

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
                        <OrchestratorPageTemplate getAppLogo={getAppLogo}>
                            <Component {...pageProps} />
                        </OrchestratorPageTemplate>
                    </QueryClientProvider>
                </OrchestratorConfigProvider>
            </main>
        </EuiProvider>
    );
}

export default CustomApp;
