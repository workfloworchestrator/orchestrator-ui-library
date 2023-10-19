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
        translationKey: 'general',
        path: '/service-tickets/general',
    },
    {
        id: 2,
        translationKey: 'notificationLog',
        path: '/service-tickets/notification-log',
    },
    {
        id: 3,
        translationKey: 'sentEmails',
        path: '/service-tickets/sent-emails',
    },
];

export const WFOServiceTicketsPageLayout = ({
    children,
    tabs = metaDataTabs,
}: MetadataLayoutProps) => {
    const router = useRouter();
    const t = useTranslations('cim.tabs');
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
