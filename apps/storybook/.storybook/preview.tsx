import { EuiProvider } from '@elastic/eui';
import {
    ColorModes,
    OrchestratorConfigProvider,
    StoreProvider,
    defaultOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';
import type { Preview } from '@storybook/react';

import { TranslationsProvider } from '../translations/translationsProvider';

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
                    <EuiProvider
                        colorMode={ColorModes.LIGHT}
                        modify={defaultOrchestratorTheme}
                    >
                        <TranslationsProvider>
                            <div style={{ margin: '3em' }}>
                                <Story />
                            </div>
                        </TranslationsProvider>
                    </EuiProvider>
                </StoreProvider>
            </OrchestratorConfigProvider>
        ),
    ],
};

export default preview;
