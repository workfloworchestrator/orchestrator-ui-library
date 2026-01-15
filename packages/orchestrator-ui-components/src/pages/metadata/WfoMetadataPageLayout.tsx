import React from 'react';
import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { EuiSpacer, EuiTab, EuiTabs } from '@elastic/eui';

import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';

interface MetadataLayoutProps {
    children: ReactNode;
    tabs?: MetaDataTab[];
}

export interface MetaDataTab {
    id: number;
    translationKey: string;
    path: string;
}

export const metaDataTabs: MetaDataTab[] = [
    {
        id: 1,
        translationKey: 'products',
        path: '/metadata/products',
    },
    {
        id: 2,
        translationKey: 'productBlocks',
        path: '/metadata/productblocks',
    },
    {
        id: 3,
        translationKey: 'resourceTypes',
        path: '/metadata/resource-types',
    },
    {
        id: 4,
        translationKey: 'workflows',
        path: '/metadata/workflows',
    },
    {
        id: 5,
        translationKey: 'tasks',
        path: '/metadata/tasks',
    },
    {
        id: 6,
        translationKey: 'scheduledTasks',
        path: '/metadata/scheduled-tasks',
    },
];

export const WfoMetadataPageLayout = ({
    children,
    tabs = metaDataTabs,
}: MetadataLayoutProps) => {
    const router = useRouter();
    const t = useTranslations('metadata');
    const currentPath = router.pathname;

    return (
        <>
            <WfoContentHeader title={t('title')} />

            <EuiTabs>
                {tabs.map(({ id, translationKey: name, path }) => (
                    <EuiTab
                        key={id}
                        isSelected={path === currentPath}
                        onClick={() => router.push(path)}
                    >
                        {t(`tabs.${name}`)}
                    </EuiTab>
                ))}
            </EuiTabs>
            <EuiSpacer size="xxl" />
            {children}
        </>
    );
};
