import React, { FC, ReactNode, useState } from 'react';
import {
    EuiButtonIcon,
    EuiPageTemplate,
    EuiHeaderSectionItem,
} from '@elastic/eui';
import { OrchestratorPageHeader } from './OrchestratorPageHeader';
import { OrchestratorSidebar } from './OrchestratorSidebar';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { IconType } from '@elastic/eui/src/components/icon';

export interface OrchestratorPageTemplateProps {
    appLogo: IconType;
    children: ReactNode;
}

export const OrchestratorPageTemplate: FC<OrchestratorPageTemplateProps> = ({
    children,
    appLogo,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

    const navigationHeight = multiplyByBaseUnit(3);

    return (
        <>
            <OrchestratorPageHeader
                logo={appLogo}
                navigationHeight={navigationHeight}
                handleLogoutClick={() =>
                    setIsSideMenuVisible(!isSideMenuVisible)
                }
            />

            <EuiHeaderSectionItem>
                <EuiButtonIcon
                    aria-label={'Toggle side bar'}
                    display="empty"
                    iconType="arrowRight"
                    color="ghost"
                    onClick={() => setIsSideMenuVisible(!isSideMenuVisible)}
                />
            </EuiHeaderSectionItem>

            {/* Sidebar and content area */}
            <EuiPageTemplate
                panelled={false}
                grow={false}
                contentBorder={false}
                minHeight={`calc(100vh - ${navigationHeight}px)`}
            >
                {isSideMenuVisible && (
                    <EuiPageTemplate.Sidebar
                        css={{
                            backgroundColor: theme.colors.body,
                        }}
                    >
                        <OrchestratorSidebar text="Sidebar" />
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
