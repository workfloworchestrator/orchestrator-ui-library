import {
    EuiProvider,
    type EuiSideNavItemType,
    EuiThemeColorMode,
} from '@elastic/eui';
import {
    ColorModes,
    OrchestratorConfigProvider,
    StoreProvider,
    WfoMenuItemLink,
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

// const [themeMode, setThemeMode] = useState<EuiThemeColorMode>(
//     ColorModes.LIGHT,
// );

const addMenuItems = (
    defaultMenuItems: EuiSideNavItemType<object>[],
): EuiSideNavItemType<object>[] => [
    ...defaultMenuItems,
    {
        name: 'Example form',
        id: '10',
        isSelected: false,
        href: '/example-form',
        renderItem: () => (
            <WfoMenuItemLink
                path={'/example-form'}
                translationString="Example form"
                isSelected={false}
            />
        ),
    },
];

const handleThemeSwitch = (newThemeMode: EuiThemeColorMode) => {
    // setThemeMode(newThemeMode);
    localStorage.setItem('themeMode', newThemeMode);
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
                            {/*<WfoPageTemplate*/}
                            {/*    getAppLogo={() =><div></div>}*/}
                            {/*    onThemeSwitch={*/}
                            {/*        handleThemeSwitch*/}
                            {/*    }*/}
                            {/*    overrideMenuItems={addMenuItems}*/}
                            {/*>*/}
                            <div style={{ margin: '3em' }}>
                                <Story />
                            </div>
                            {/*</WfoPageTemplate>*/}
                        </TranslationsProvider>
                    </EuiProvider>
                </StoreProvider>
            </OrchestratorConfigProvider>
        ),
    ],
};

export default preview;
