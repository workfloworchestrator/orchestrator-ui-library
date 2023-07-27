import React from 'react';
import type { ReactNode } from 'react';
import { EuiSpacer, EuiPageHeader, EuiTab, EuiTabs } from '@elastic/eui';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

interface MetadataLayoutProps {
    children: ReactNode;
}

export const MetaDataLayout = ({ children }: MetadataLayoutProps) => {
    const router = useRouter();
    const t = useTranslations('metadata.tabs')
    const currentPath = router.pathname;

    const tabs = [
        {
            id: 1,
            name: t('products'),
            path: '/metadata/products',
        },
        {
            id: 2,
            name: t('productBlocks'),
            path: '/metadata/productblocks',
        },
        {
            id: 3,
            name: t('resourceTypes'),
            path: '/metadata/resource-types',
        },
        {
            id: 4,
            name: t('fixedInputs'),
            path: '/metadata/fixed-inputs',
        },
        {
            id: 5,
            name: t('workflows'),
            path: '/metadata/workflows',
        },
    ];

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Metadata" />
            <EuiSpacer size="m" />
            <EuiTabs>
                {tabs.map(({ id, name, path }) => (
                    <EuiTab
                        key={id}
                        isSelected={path === currentPath}
                        onClick={() => router.push(path)}
                    >
                        {name}
                    </EuiTab>
                ))}
            </EuiTabs>
            <EuiSpacer size="xxl" />
            {children}
        </>
    );
};
