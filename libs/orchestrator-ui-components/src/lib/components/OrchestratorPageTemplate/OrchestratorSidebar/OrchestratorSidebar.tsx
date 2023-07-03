import React, { FC } from 'react';
import { EuiButton, EuiSideNav, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router'


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
                id: '1',
                items: [
                    {
                      name: 'Start',
                      id: '2',
                      onClick: (e) => {
                          e.preventDefault();
                          routeTo('/');
                      },
                      href: '/',
                    },
                    {
                        name: 'Processes',
                        id: '3',
                        onClick: (e) => {
                            e.preventDefault();
                            alert('TODO')
                        },
                        href: '/',
                    },
                    {
                        name: 'Subscriptions',
                        id: '4',
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/subscriptions');
                        },
                        href: '/subscriptions',
                    },
                    {
                        name: 'Metadata',
                        id: '5',
                        items: [
                            {
                                name: 'Products',
                                id: '5.1',
                                onClick: (e) => {
                                  e.preventDefault();
                                  routeTo('/metadata/products');
                                },
                            },
                            {
                              name: 'Productblocks',
                              id: '5.2',
                              onClick: (e) => {
                                e.preventDefault();
                                routeTo('/metadata/productblocks');
                              },
                            },
                            {
                                name: 'Resource types',
                                id: '5.3',
                                onClick: (e) => {
                                  e.preventDefault();
                                  routeTo('/metadata/resource-types');
                                },
                            },
                            {
                                name: 'Fixed inputs',
                                id: '5.4',
                                onClick: (e) => {
                                  e.preventDefault();
                                  routeTo('/metadata/fixed-inputs');
                                },
                            },
                            {
                              name: 'Workflows',
                              id: '5.5',
                              onClick: (e) => {
                                e.preventDefault();
                                routeTo('/metadata/workflows');
                              },
                          },
                        ]
                    },
                    {
                        name: 'Tasks',
                        id: '6',
                        onClick: (e) => {
                            e.preventDefault();
                            alert('TODO')
                        },
                        href: '/',                      
                    },
                    {
                        name: 'Settings',
                        id: '7',
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/settings');
                        },
                        href: '/settings',
                    },
                    {
                        name: 'LIR prefixes',
                        id: '8',
                        onClick: (e) => {
                            e.preventDefault();
                            alert('TODO')
                        },
                        href: '/',
                    }
                ],
            },
        ]}
    />
);
