import React, { FC, ReactElement, ReactNode, useState } from 'react';
import { EuiPageTemplate } from '@elastic/eui';
import { OrchestratorPageHeader } from '../OrchestratorPageHeader';
import { OrchestratorSidebar } from '../OrchestratorSidebar';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';

export interface OrchestratorPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    children: ReactNode;
}

export const OrchestratorPageTemplate: FC<OrchestratorPageTemplateProps> = ({
    children,
    getAppLogo,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

    const navigationHeight = multiplyByBaseUnit(3);

    return (
        <>
            <OrchestratorPageHeader
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
                        <OrchestratorSidebar />
                    </EuiPageTemplate.Sidebar>
                )}
                <EuiPageTemplate.Section
                    css={{
                        backgroundColor: theme.colors.emptyShade,
                    }}
                >
                    {children}
                </EuiPageTemplate.Section>
            </EuiPageTemplate>
        </>
    );
};
