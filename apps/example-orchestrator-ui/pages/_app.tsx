import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import { EuiProvider, EuiPageTemplate, EuiButton } from '@elastic/eui';
import { defaultOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

function CustomApp({ Component, pageProps }: AppProps) {
    const [sideMenuIsVisible, setSideMenuIsVisible] = useState(true);

    const navigationHeight = 50;

    return (
        <EuiProvider colorMode="light" modify={defaultOrchestratorTheme}>
            <Head>
                <title>Welcome to example-orchestrator-ui!</title>
            </Head>
            <main className="app">
                <>
                    <div
                        style={{
                            backgroundColor: 'blue',
                            color: 'white',
                            height: navigationHeight,
                        }}
                    >
                        <span>Navigation</span>
                        <EuiButton
                            onClick={() =>
                                setSideMenuIsVisible(!sideMenuIsVisible)
                            }
                        >
                            Toggle SideMenu
                        </EuiButton>
                    </div>
                </>
                <EuiPageTemplate
                    offset={0}
                    grow={false}
                    contentBorder={false}
                    minHeight={`calc(100vh - ${navigationHeight}px)`}
                >
                    {sideMenuIsVisible && (
                        <EuiPageTemplate.Sidebar
                            style={{ backgroundColor: 'red' }}
                        >
                            <div>Cool</div>
                        </EuiPageTemplate.Sidebar>
                    )}
                    <EuiPageTemplate.Section
                        style={{ backgroundColor: 'grey' }}
                    >
                        <Component {...pageProps} />
                    </EuiPageTemplate.Section>
                </EuiPageTemplate>
            </main>
        </EuiProvider>
    );
}

export default CustomApp;
