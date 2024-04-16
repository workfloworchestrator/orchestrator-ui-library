import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { SessionProvider } from 'next-auth/react';
import { IntlProvider } from 'next-intl';
import 'src/font/inter.css';

import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.min.css';
import '@elastic/eui/dist/eui_theme_light.min.css';

import { WfoAuth } from '../src/components/WfoAuth';
import { OrchestratorConfigProvider } from '../src/contexts/OrchestratorConfigContext';
import { StoreProvider } from '../src/rtk/storeProvider';
import { defaultOrchestratorTheme } from '../src/theme/defaultOrchestratorTheme';

/** @type { import('@storybook/react').Preview } */

const placeholder = 'http://placeholder';
const placeHolderConfig = {
    orchestratorApiBaseUrl: placeholder,
    engineStatusEndpoint: placeholder,
    graphqlEndpointCore: placeholder,
    processStatusCountsEndpoint: placeholder,
    processesEndpoint: placeholder,
    environmentName: 'storybook',
    subscriptionActionsEndpoint: placeholder,
    subscriptionProcessesEndpoint: placeholder,
    orchestratorWebsocketUrl: placeholder,
    authActive: false,
    useWebSockets: false,
    useThemeToggle: false,
};

const queryClientConfig = {
    defaultOptions: {
        queries: {
            cacheTime: 5 * 1000,
            refetchOnWindowFocus: true,
        },
    },
};

const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        (Story) => {
            const queryClient = new QueryClient(queryClientConfig);

            return (
                <OrchestratorConfigProvider
                    initialOrchestratorConfig={placeHolderConfig}
                >
                    <StoreProvider
                        initialOrchestratorConfig={placeHolderConfig}
                    >
                        <SessionProvider>
                            <WfoAuth>
                                <EuiProvider
                                    colorMode={'LIGHT'}
                                    modify={defaultOrchestratorTheme}
                                >
                                    <QueryClientProvider
                                        client={queryClient}
                                        contextSharing={true}
                                    >
                                        <IntlProvider locale="enGB">
                                            <Story />
                                        </IntlProvider>
                                    </QueryClientProvider>
                                </EuiProvider>
                            </WfoAuth>
                        </SessionProvider>
                    </StoreProvider>
                </OrchestratorConfigProvider>
            );
        },
    ],
};

export default preview;
