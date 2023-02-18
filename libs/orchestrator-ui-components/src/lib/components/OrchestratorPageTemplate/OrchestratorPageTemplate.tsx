import React, { FC, ReactNode, useState } from 'react';
import {
    EuiButton,
    EuiButtonIcon,
    EuiPageTemplate,
    EuiText,
    EuiFlexItem,
    EuiFlexGroup,
    EuiSideNav,
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
                            aria-label={'Toggle side bar'}
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
                        <EuiSideNav
                            mobileTitle="Nav Items"
                            isOpenOnMobile={false}
                            items={[
                                {
                                    name: 'Menu',
                                    id: 1,
                                    items: [
                                        {
                                            name: 'Home',
                                            id: 2,
                                            href: '/',
                                            // onClick: () => selectItem(),
                                        },
                                        {
                                            name: 'Subscriptions',
                                            id: 3,
                                            href: '/subscriptions',
                                            // onClick: () => selectItem(),
                                        },
                                        // {
                                        //     name: 'Anchor item',
                                        //     id: 4,
                                        //     href: '#',
                                        // },
                                    ],
                                },
                            ]}
                        />
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
