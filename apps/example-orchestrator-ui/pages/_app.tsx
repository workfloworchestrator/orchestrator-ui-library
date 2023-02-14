import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import React from 'react';
import { EuiProvider } from '@elastic/eui';
import { defaultOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <EuiProvider colorMode="light" modify={defaultOrchestratorTheme}>
            <Head>
                <title>Welcome to example-orchestrator-ui!</title>
            </Head>
            <main className="app">
                <Component {...pageProps} />
            </main>
        </EuiProvider>
    );
}

export default CustomApp;
