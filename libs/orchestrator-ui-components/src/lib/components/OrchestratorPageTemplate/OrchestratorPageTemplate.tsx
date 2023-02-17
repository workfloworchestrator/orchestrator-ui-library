import React, { FC, ReactNode, useState } from 'react';
import {
    EuiButtonIcon,
    EuiPageTemplate,
    EuiText,
    EuiFlexItem,
    EuiFlexGroup,
    useEuiTheme,
} from '@elastic/eui';

export interface OrchestratorPageTemplateProps {
    children: ReactNode;
}

export const OrchestratorPageTemplate: FC<OrchestratorPageTemplateProps> = ({
    children,
}) => {
    const { euiTheme } = useEuiTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

    const multiplyBaseValue = (multiplier: number) =>
        euiTheme.base * multiplier;

    const navigationHeight = multiplyBaseValue(3);

    return (
        <>
            {/* Top navigation */}
            <EuiFlexGroup
                direction="row"
                justifyContent="spaceBetween"
                alignItems="center"
                css={{
                    backgroundColor: euiTheme.colors.primary,
                    height: navigationHeight,
                    paddingLeft: euiTheme.size.l,
                    paddingRight: euiTheme.size.l,
                }}
            >
                <EuiFlexItem>
                    <EuiFlexGroup alignItems="center">
                        <EuiText color={euiTheme.colors.emptyShade}>
                            Orchestrator
                        </EuiText>
                    </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFlexGroup direction="row" justifyContent="flexEnd">
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

            {/* Sidebar and content area */}
            <EuiPageTemplate
                grow={false}
                contentBorder={false}
                minHeight={`calc(100vh - ${navigationHeight})`}
            >
                {isSideMenuVisible && (
                    <EuiPageTemplate.Sidebar
                        css={{ backgroundColor: euiTheme.colors.body }}
                    >
                        <div>Sidebar</div>
                    </EuiPageTemplate.Sidebar>
                )}
                <EuiPageTemplate.Section
                    css={{ backgroundColor: euiTheme.colors.emptyShade }}
                >
                    {children}
                </EuiPageTemplate.Section>
            </EuiPageTemplate>
        </>
    );
};
