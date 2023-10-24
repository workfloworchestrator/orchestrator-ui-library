import React, { FC, ReactElement, ReactNode, useState } from 'react';
import { EuiPageTemplate } from '@elastic/eui';
import { WfoPageHeader } from '../WfoPageHeader';
import { WfoSidebar } from '../WfoSidebar';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoBreadcrumbs } from '../WfoBreadcrumbs';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';

export interface WfoPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
    children: ReactNode;
}

export const WfoPageTemplate: FC<WfoPageTemplateProps> = ({
    children,
    getAppLogo,
    overrideMenuItems,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

    const navigationHeight = multiplyByBaseUnit(3);

    return (
        <>
            <WfoPageHeader
                getAppLogo={getAppLogo}
                navigationHeight={navigationHeight}
                handleLogoutClick={() =>
                    setIsSideMenuVisible(!isSideMenuVisible)
                }
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
