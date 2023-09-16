import React, { FC, ReactElement, ReactNode, useState } from 'react';
import { EuiPageTemplate } from '@elastic/eui';
import { WFOPageHeader } from '../WFOPageHeader';
import { WFOSidebar } from '../WFOSidebar';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WFOBreadcrumbs } from '../WFOBreadcrumbs';

export interface WFOPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    children: ReactNode;
}

export const WFOPageTemplate: FC<WFOPageTemplateProps> = ({
    children,
    getAppLogo,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

    const navigationHeight = multiplyByBaseUnit(3);

    return (
        <>
            <WFOPageHeader
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
                            backgroundColor: theme.colors.lightestShade,
                        }}
                    >
                        <WFOSidebar />
                    </EuiPageTemplate.Sidebar>
                )}
                <EuiPageTemplate.Section
                    css={{
                        backgroundColor: theme.colors.emptyShade,
                    }}
                >
                    <WFOBreadcrumbs />
                    {children}
                </EuiPageTemplate.Section>
            </EuiPageTemplate>
        </>
    );
};
