import React, { FC, ReactElement, ReactNode, useRef, useState } from 'react';

import type { EuiThemeColorMode } from '@elastic/eui';
import { EuiPageTemplate, EuiSideNavItemType } from '@elastic/eui';

import { WfoBreadcrumbs, WfoPageHeader, WfoSidebar } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { ProductLifecycleStatus } from '@/types';

import { ContentContextProvider } from './ContentContext';
import { getPageTemplateStyles } from './styles';

export interface WfoPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
    overrideStartWorkflowFilters?: (ProductLifecycleStatus | string)[];
    onThemeSwitch: (theme: EuiThemeColorMode) => void;
    children: ReactNode;
}

export const WfoPageTemplate: FC<WfoPageTemplateProps> = ({
    children,
    getAppLogo,
    overrideMenuItems,
    overrideStartWorkflowFilters,
    onThemeSwitch,
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
                onThemeSwitch={onThemeSwitch}
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
