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
        id: 5,
        translationKey: 'workflows',
        path: '/metadata/workflows',
    },
];

export const WFOMetadataPageLayout = ({
    children,
    tabs = metaDataTabs,
}: MetadataLayoutProps) => {
    const router = useRouter();
    const t = useTranslations('metadata.tabs');
    const currentPath = router.pathname;

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Metadata" />
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
