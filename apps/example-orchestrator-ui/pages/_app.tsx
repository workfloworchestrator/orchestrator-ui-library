import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { EuiProvider } from '@elastic/eui';
import {
    defaultOrchestratorTheme,
    OrchestratorPageTemplate,
    DataProvider,
} from '@orchestrator-ui/orchestrator-ui-components';
import '@elastic/eui/dist/eui_theme_light.min.css';
import { getAppLogo } from '../components/AppLogo/AppLogo';
import { STATUS_ENDPOINT } from '../constants';

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <EuiProvider colorMode="light" modify={defaultOrchestratorTheme}>
            <Head>
                <title>Welcome to example-orchestrator-ui!</title>
            </Head>
            <main className="app">
                <DataProvider statusEndpointUrl={STATUS_ENDPOINT}>
                    <OrchestratorPageTemplate getAppLogo={getAppLogo}>
                        <Component {...pageProps} />
                    </OrchestratorPageTemplate>
                </DataProvider>
            </main>
        </EuiProvider>
    );
}

export default CustomApp;
