import React, { FC } from 'react';
import { EuiSideNav } from '@elastic/eui';

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
                name: 'Menu',
                id: 1,
                items: [
                    {
                        name: 'Home',
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
                        // TODO: NEXT router / EUI seem to cause unneeded re-renders. At least in dev mode,
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/subscriptions');
                        },
                        href: '/subscriptions',
                    },
                    {
                        name: 'Subscriptions table',
                        id: 4,
                        // TODO: NEXT router / EUI seem to cause unneeded re-renders. At least in dev mode,
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/subscriptions-table');
                        },
                        href: '/subscriptions-table',
                    },
                    {
                        name: 'Subscriptions grid',
                        id: 5,
                        // TODO: NEXT router / EUI seem to cause unneeded re-renders. At least in dev mode,
                        onClick: (e) => {
                            e.preventDefault();
                            routeTo('/subscriptions-grid');
                        },
                        href: '/subscriptions-grid',
                    },
                ],
            },
        ]}
    />
);
