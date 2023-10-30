import React from 'react';
import type { ReactNode } from 'react';
import { EuiSpacer, EuiPageHeader, EuiTab, EuiTabs } from '@elastic/eui';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

interface MetadataLayoutProps {
    children: ReactNode;
    tabs?: MetaDataTab[];
}

export interface MetaDataTab {
    id: number;
    translationKey: string;
    path: string;
}

const metaDataTabs: MetaDataTab[] = [
    {
        id: 1,
        translationKey: 'active',
        path: '/service-tickets/active',
    },
    {
        id: 2,
        translationKey: 'completed',
        path: '/service-tickets/completed',
    },
];

export const WfoServiceTicketsPageLayout = ({
    children,
    tabs = metaDataTabs,
}: MetadataLayoutProps) => {
    const router = useRouter();
    const t = useTranslations('cim.serviceTickets.tabs');
    const currentPath = router.pathname;

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Service tickets" />
            <EuiSpacer size="m" />
            <EuiTabs>
                {tabs.map(({ id, translationKey: name, path }) => (
                    <EuiTab
                        key={id}
                        isSelected={path === currentPath}
                        onClick={() => router.push(path)}
                    >
                        {t(name)}
                    </EuiTab>
                ))}
            </EuiTabs>
            <EuiSpacer size="xxl" />
            {children}
        </>
    );
};
