import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { EuiProvider } from '@elastic/eui';
import {
    defaultOrchestratorTheme,
    OrchestratorPageTemplate,
} from '@orchestrator-ui/orchestrator-ui-components';

function CustomApp({ Component, pageProps }: AppProps) {
    return (
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
    );
}

export default CustomApp;
