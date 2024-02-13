import React, { FC, ReactElement, ReactNode, useState } from 'react';

import { signOut } from 'next-auth/react';

import { EuiPageTemplate } from '@elastic/eui';
import type { EuiThemeColorMode } from '@elastic/eui';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';

import { useStreamMessagesQuery } from '@/rtk/endpoints/streamMessages';

import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoBreadcrumbs } from '../WfoBreadcrumbs';
import { WfoPageHeader } from '../WfoPageHeader';
import { WfoSidebar } from '../WfoSidebar';

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
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
    useStreamMessagesQuery('start');
    const navigationHeight = multiplyByBaseUnit(3);

    return (
        <>
            <WfoPageHeader
                getAppLogo={getAppLogo}
                navigationHeight={navigationHeight}
                handleSideMenuClick={() =>
                    setIsSideMenuVisible((prevState) => !prevState)
                }
                handleLogoutClick={signOut}
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
                        css={{
                            backgroundColor: theme.colors.body,
                        }}
                    >
                        <WfoSidebar overrideMenuItems={overrideMenuItems} />
                    </EuiPageTemplate.Sidebar>
                )}
                <EuiPageTemplate.Section
                    css={{
                        backgroundColor: theme.colors.emptyShade,
                    }}
                >
                    <WfoBreadcrumbs />
                    {children}
                </EuiPageTemplate.Section>
            </EuiPageTemplate>
        </>
    );
};
