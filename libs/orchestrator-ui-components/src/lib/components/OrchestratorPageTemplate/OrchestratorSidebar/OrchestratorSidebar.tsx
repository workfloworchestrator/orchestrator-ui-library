import React, { FC } from 'react';
import { EuiButton, EuiSideNav, EuiSpacer } from '@elastic/eui';

export interface OrchestratorSidebarProps {
    routeTo: (route: string) => void;
}

export const OrchestratorSidebar: FC<OrchestratorSidebarProps> = ({
    routeTo,
}) => (
    <EuiSideNav
        mobileTitle="Nav Items"
        isOpenOnMobile={false}
        items={[
            {
                renderItem: () => (
                    <>
                        <EuiButton
                            onClick={(
                                e: React.MouseEvent<
                                    HTMLButtonElement | HTMLElement,
                                    MouseEvent
                                >,
                            ) => {
                                e.preventDefault();
                                routeTo('/new-process');
                            }}
                            iconType="plus"
                            fullWidth
                        >
                            New Process
                        </EuiButton>
                        <EuiSpacer size="m" />
                    </>
                ),
                name: 'Menu',
                id: 1,
                items: [
                    {
                        name: 'Start',
                        id: 2,
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/');
                        },
                        href: '/',
                    },
                    {
                        name: 'Subscriptions',
                        id: 3,
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/subscriptions');
                        },
                        href: '/subscriptions',
                    },
                    {
                        name: 'Settings',
                        id: 4,
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/settings');
                        },
                        href: '/settings',
                    },
                ],
            },
        ]}
    />
);
