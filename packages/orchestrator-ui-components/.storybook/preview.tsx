import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { SessionProvider } from 'next-auth/react';
import { IntlProvider } from 'next-intl';

import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.min.css';
import '@elastic/eui/dist/eui_theme_light.min.css';
import type { Preview } from '@storybook/react';

import { OrchestratorConfigProvider } from '../src/contexts/OrchestratorConfigContext';
import { StoreProvider } from '../src/rtk/storeProvider';

const placeholderUrl = 'https://storybook';
const storybookConfigWithPlaceHolders = {
    environmentName: 'storybook',
    orchestratorWebsocketUrl: 'wss://storybook',
    orchestratorApiBaseUrl: placeholderUrl + '/api',
    graphqlEndpointCore: placeholderUrl + '/graphql',
    engineStatusEndpoint: placeholderUrl + '/engine/status',
    processStatusCountsEndpoint: placeholderUrl + '/process/status/counts',
    processesEndpoint: placeholderUrl + '/processes',
    subscriptionActionsEndpoint: placeholderUrl + '/subscription/actions',
    subscriptionProcessesEndpoint: placeholderUrl + '/subscription/processes',
    authActive: false,
    useWebSockets: false,
    useThemeToggle: false,
};

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => {
            return (
                <OrchestratorConfigProvider
                    initialOrchestratorConfig={storybookConfigWithPlaceHolders}
                >
                    <Story />
                </OrchestratorConfigProvider>
            );
        },
        (Story) => {
            return (
                <StoreProvider
                    initialOrchestratorConfig={storybookConfigWithPlaceHolders}
                >
                    <Story />
                </StoreProvider>
            );
        },
        (Story) => {
            return (
                <EuiProvider>
                    <Story />
                </EuiProvider>
            );
        },
        (Story) => {
            return (
                <div style={{ border: 'thin solid green' }}>
                    <Story />
                </div>
            );
        },
        (Story) => {
            return (
                <IntlProvider locale={'enGB'}>
                    <Story />
                </IntlProvider>
            );
        },
        (Story) => {
            return (
                <SessionProvider>
                    <Story />
                </SessionProvider>
            );
        },
        (Story) => {
            return (
                <QueryClientProvider client={new QueryClient()}>
                    <Story />
                </QueryClientProvider>
            );
        },
    ],
};

export default preview;
