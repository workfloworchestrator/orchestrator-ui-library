import React, { FC, ReactElement, ReactNode, useRef, useState } from 'react';

import type { EuiThemeColorMode } from '@elastic/eui';
import { EuiPageTemplate } from '@elastic/eui';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';

import { WfoBreadcrumbs, WfoPageHeader, WfoSidebar } from '@/components';
import { ContentContextProvider } from '@/components/WfoPageTemplate/WfoPageTemplate/ContentContext';
import { getPageTemplateStyles } from '@/components/WfoPageTemplate/WfoPageTemplate/styles';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

export interface WfoPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
    onThemeSwitch: (theme: EuiThemeColorMode) => void;
    children: ReactNode;
}

export const WfoPageTemplate: FC<WfoPageTemplateProps> = ({
    children,
    getAppLogo,
    overrideMenuItems,
    onThemeSwitch,
}) => {
    const { multiplyByBaseUnit } = useOrchestratorTheme();
    const { getSidebarStyle } = useWithOrchestratorTheme(getPageTemplateStyles);

    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
    const navigationHeight = multiplyByBaseUnit(3);

    const headerRowRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <WfoPageHeader
                getAppLogo={getAppLogo}
                navigationHeight={navigationHeight}
                onThemeSwitch={onThemeSwitch}
            />
            {/* Sidebar and content area */}
            <EuiPageTemplate
                panelled={false}
                grow={false}
                contentBorder={false}
                minHeight={`calc(100vh - ${navigationHeight}px)`}
                restrictWidth={false}
            >
                {isSideMenuVisible && (
                    <EuiPageTemplate.Sidebar
                        css={getSidebarStyle(navigationHeight)}
                    >
                        <WfoSidebar overrideMenuItems={overrideMenuItems} />
                    </EuiPageTemplate.Sidebar>
                )}

                <ContentContextProvider
                    contentRef={headerRowRef}
                    navigationHeight={navigationHeight}
                >
                    <EuiPageTemplate.Section>
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
