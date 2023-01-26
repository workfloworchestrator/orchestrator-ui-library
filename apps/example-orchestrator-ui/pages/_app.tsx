import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import React from 'react';

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Welcome to example-orchestrator-ui!</title>
            </Head>
            <main className="app">
                <Component {...pageProps} />
            </main>
        </>
    );
}

export default CustomApp;
