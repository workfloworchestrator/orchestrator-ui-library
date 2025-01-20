import type { Preview } from '@storybook/react';
import { OrchestratorConfigProvider, StoreProvider } from '@orchestrator-ui/orchestrator-ui-components';
import { TranslationsProvider } from '../translations/translationsProvider';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // next 12
import { default as mockRouter } from 'next-router-mock';

const storybookConfig = {
    environmentName: 'Development',
    graphqlEndpointCore: '',
    orchestratorApiBaseUrl: '',
    orchestratorWebsocketUrl: '',
    authActive: true,
    useWebSockets: false,
    useThemeToggle: false,
    showWorkflowInformationLink: false,
    workflowInformationLinkUrl: '',
    enableSupportMenuItem: false,
    supportMenuItemUrl: '',
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
        (Story) => (
            <OrchestratorConfigProvider
                initialOrchestratorConfig={storybookConfig}
            >
                <StoreProvider initialOrchestratorConfig={storybookConfig}>
                    {/*<TranslationsProvider>*/}
                        <div style={{ margin: '3em' }}>
                            <Story />
                        </div>
                    {/*</TranslationsProvider>*/}
                </StoreProvider>
            </OrchestratorConfigProvider>
        ),
    ]
};

export default preview;
