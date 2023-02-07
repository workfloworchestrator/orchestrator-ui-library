import {AppProps} from 'next/app';
import Head from 'next/head';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

import '@elastic/eui/dist/eui_theme_dark.css';
import React from 'react';

import {EuiProvider} from '@elastic/eui';


const client = new ApolloClient({
    uri: 'https://api.dev.automation.surf.net/pythia',
    cache: new InMemoryCache(),
});

function CustomApp({Component, pageProps}: AppProps) {
    return (
        <ApolloProvider client={client}>
            <EuiProvider colorMode="dark">
                <Head>
                    <title>Welcome to example-orchestrator-ui!</title>
                </Head>
                <main className="app">
                    <Component {...pageProps} />
                </main>
            </EuiProvider>
        </ApolloProvider>
    );
}

export default CustomApp;
