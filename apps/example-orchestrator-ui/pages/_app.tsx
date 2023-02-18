import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { EuiProvider } from '@elastic/eui';
import {
    defaultOrchestratorTheme,
    OrchestratorPageTemplate,
} from '@orchestrator-ui/orchestrator-ui-components';
import { QueryClient, QueryClientProvider } from 'react-query';

// TODO: Ricardo -> I had to add this, or the tables would be unstyled?
import '@elastic/eui/dist/eui_theme_light.min.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            staleTime: 3600,
            refetchOnMount: false,
        },
    },
});

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <EuiProvider colorMode="light" modify={defaultOrchestratorTheme}>
                <Head>
                    <title>Welcome to example-orchestrator-ui!</title>
                </Head>
                <main className="app">
                    <OrchestratorPageTemplate>
                        <Component {...pageProps} />
                    </OrchestratorPageTemplate>
                </main>
            </EuiProvider>
        </QueryClientProvider>
    );
}

export default CustomApp;
