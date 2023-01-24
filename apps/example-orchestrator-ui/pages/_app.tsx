import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import {
    defaultTheme,
    MyTheme,
    OrchestratorThemeProvider,
} from 'best-custom-react-button';
import React from 'react';

function CustomApp({ Component, pageProps }: AppProps) {
    const myTheme: MyTheme = {
        colors: {
            ...defaultTheme.colors,
            secondary: 'grey',
        },
    };

    return (
        <OrchestratorThemeProvider theme={myTheme}>
            <Head>
                <title>Welcome to example-orchestrator-ui!</title>
            </Head>
            <main className="app">
                <Component {...pageProps} />
            </main>
        </OrchestratorThemeProvider>
    );
}

export default CustomApp;
