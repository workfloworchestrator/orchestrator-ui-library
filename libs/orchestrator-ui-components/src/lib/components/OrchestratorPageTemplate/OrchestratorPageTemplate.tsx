import React, { FC, ReactNode, useState } from 'react';
import {
    EuiButton,
    EuiButtonIcon,
    EuiPageTemplate,
    EuiText,
    EuiFlexItem,
    useEuiTheme,
} from '@elastic/eui';
import { EuiFlexGroup } from '@elastic/eui';

export interface OrchestratorPageTemplateProps {
    children: ReactNode;
}

export const OrchestratorPageTemplate: FC<OrchestratorPageTemplateProps> = ({
    children,
}) => {
    const { euiTheme } = useEuiTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
    const navigationHeight = 50;

    return (
        <>
            <EuiFlexGroup
                direction="row"
                justifyContent="spaceBetween"
                alignItems="center"
                style={{
                    backgroundColor: euiTheme.colors.primary,
                    height: navigationHeight,
                }}
            >
                <EuiFlexItem>
                    <EuiText color={euiTheme.colors.emptyShade}>
                        Orchestrator
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFlexGroup direction="row" justifyContent="flexEnd">
                        <EuiButton
                            size="s"
                            onClick={() =>
                                setIsSideMenuVisible(!isSideMenuVisible)
                            }
                        >
                            Toggle SideMenu
                        </EuiButton>
                        <EuiButtonIcon
                            display="empty"
                            iconType="arrowRight"
                            color="ghost"
                            onClick={() =>
                                setIsSideMenuVisible(!isSideMenuVisible)
                            }
                        />
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiPageTemplate
                grow={false}
                contentBorder={false}
                minHeight={`calc(100vh - ${navigationHeight}px)`}
            >
                {isSideMenuVisible && (
                    <EuiPageTemplate.Sidebar
                        style={{ backgroundColor: euiTheme.colors.body }}
                    >
                        <div>Sidebar</div>
                    </EuiPageTemplate.Sidebar>
                )}
                <EuiPageTemplate.Section
                    style={{ backgroundColor: euiTheme.colors.emptyShade }}
                >
                    {children}
                </EuiPageTemplate.Section>
            </EuiPageTemplate>
        </>
    );
};
