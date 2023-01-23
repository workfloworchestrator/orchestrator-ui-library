import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { Theme, ThemeProvider } from '@emotion/react';
import { defaultTheme } from 'best-custom-react-button';

function CustomApp({ Component, pageProps }: AppProps) {
    const myTheme: Theme = {
        ...defaultTheme,
        colors: {
            primary: 'green',
            secondary: 'yellow',
        },
    };

    return (
        <ThemeProvider theme={myTheme}>
            <Head>
                <title>Welcome to example-orchestrator-ui!</title>
            </Head>
            <main className="app">
                <Component {...pageProps} />
            </main>
        </ThemeProvider>
    );
}

export default CustomApp;
