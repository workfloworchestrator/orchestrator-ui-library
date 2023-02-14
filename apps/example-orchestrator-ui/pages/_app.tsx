import { AppProps } from 'next/app';
import Head from 'next/head';

import '@elastic/eui/dist/eui_theme_dark.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query'

import { EuiProvider } from '@elastic/eui';

const queryClient = new QueryClient()



function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <EuiProvider colorMode="dark">
                <Head>
                    <title>Welcome to example-orchestrator-ui!</title>
                </Head>
                <main className="app">
                    <Component {...pageProps} />
                </main>
            </EuiProvider>
        </QueryClientProvider>
    );
}

export default CustomApp;
