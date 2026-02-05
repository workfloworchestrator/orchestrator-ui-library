import React, {
    FC,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';

import type { EuiThemeColorMode } from '@elastic/eui';
import {
    EuiPageTemplate,
    EuiSideNavItemType,
    EuiThemeProvider,
} from '@elastic/eui';

import { WfoBreadcrumbs, WfoPageHeader, WfoSidebar } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { wfoThemeModifications } from '@/theme';
import { ColorModes, ProductLifecycleStatus } from '@/types';

import { ContentContextProvider } from './ContentContext';
import { getPageTemplateStyles } from './styles';

export interface WfoPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
    overrideStartWorkflowFilters?: (ProductLifecycleStatus | string)[];
    children: ReactNode;
    colorMode: EuiThemeColorMode;
    setColorMode: React.Dispatch<React.SetStateAction<EuiThemeColorMode>>;
}

export const WfoPageTemplate: FC<WfoPageTemplateProps> = (props) => {
    const { colorMode, setColorMode } = props;
    const handleColorModeSwitch = (newColorMode: EuiThemeColorMode) => {
        setColorMode(newColorMode);
        localStorage.setItem('colorMode', newColorMode);
    };

    useEffect(() => {
        // Initialize theme mode from localStorage or set it to 'light' if not present
        const storedColorMode = localStorage.getItem('colorMode');
        if (
            storedColorMode !== ColorModes.LIGHT &&
            storedColorMode !== ColorModes.DARK
        ) {
            handleColorModeSwitch(ColorModes.LIGHT);
        } else {
            handleColorModeSwitch(storedColorMode);
        }
    }, []);

    return (
        <EuiThemeProvider modify={wfoThemeModifications} colorMode={colorMode}>
            <WfoPageTemplateContent
                {...props}
                handleColorModeSwitch={handleColorModeSwitch}
            />
        </EuiThemeProvider>
    );
};

const WfoPageTemplateContent: FC<
    WfoPageTemplateProps & {
        handleColorModeSwitch: (mode: EuiThemeColorMode) => void;
    }
> = ({
    children,
    getAppLogo,
    overrideMenuItems,
    overrideStartWorkflowFilters,
    handleColorModeSwitch,
}) => {
    const { getSidebarStyle, NAVIGATION_HEIGHT } = useWithOrchestratorTheme(
        getPageTemplateStyles,
    );

    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
    const headerRowRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <WfoPageHeader
                getAppLogo={getAppLogo}
                navigationHeight={NAVIGATION_HEIGHT}
                onColorModeSwitch={handleColorModeSwitch}
            />
            {/* Sidebar and content area */}
            <EuiPageTemplate
                panelled={false}
                grow={false}
                contentBorder={false}
                restrictWidth={false}
            >
                {isSideMenuVisible && (
                    <EuiPageTemplate.Sidebar
                        css={getSidebarStyle(NAVIGATION_HEIGHT)}
                    >
                        <WfoSidebar
                            overrideMenuItems={overrideMenuItems}
                            overrideStartWorkflowFilters={
                                overrideStartWorkflowFilters
                            }
                        />
                    </EuiPageTemplate.Sidebar>
                )}

                <ContentContextProvider
                    contentRef={headerRowRef}
                    navigationHeight={NAVIGATION_HEIGHT}
                >
                    <EuiPageTemplate.Section
                        css={{
                            minHeight: `calc(100vh - ${NAVIGATION_HEIGHT}px)`,
                        }}
                    >
                        <WfoBreadcrumbs
                            handleSideMenuClick={() =>
                                setIsSideMenuVisible((prevState) => !prevState)
                            }
                        />
                        {children}
                    </EuiPageTemplate.Section>
                </ContentContextProvider>
            </EuiPageTemplate>
        </>
    );
};
