import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import { EuiProvider } from '@elastic/eui';
import {
    defaultOrchestratorTheme,
    OrchestratorPageTemplate,
} from '@orchestrator-ui/orchestrator-ui-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@elastic/eui/dist/eui_theme_light.min.css';
import { IconType } from '@elastic/eui/src/components/icon/icon';
import Image from 'next/image';

const config = {
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 60 * 1000,
            cacheTime: 5 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
};

function CustomApp({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient(config));
    const appLogo: IconType = () => (
        <Image
            src="/logo-orchestrator.svg"
            alt="Orchestrator Logo"
            width={134}
            height={32}
        />
    );

    return (
        <QueryClientProvider client={queryClient}>
            <EuiProvider colorMode="light" modify={defaultOrchestratorTheme}>
                <Head>
                    <title>Welcome to example-orchestrator-ui!</title>
                </Head>
                <main className="app">
                    <OrchestratorPageTemplate appLogo={appLogo}>
                        <Component {...pageProps} />
                    </OrchestratorPageTemplate>
                </main>
            </EuiProvider>
        </QueryClientProvider>
    );
}

export default CustomApp;
