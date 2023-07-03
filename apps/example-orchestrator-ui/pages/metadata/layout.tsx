import type { ReactNode } from 'react';
import { EuiSpacer, EuiPageHeader, EuiTab, EuiTabs } from '@elastic/eui';
import { useRouter } from 'next/router';

interface MetadataLayoutProps {
    children: ReactNode;
}

export const MetaDataLayout = ({ children }: MetadataLayoutProps) => {
    const router = useRouter();
    const currentPath = router.pathname;

    const tabs = [
        {
            id: 1,
            name: 'Products',
            path: '/metadata/products',
        },
        {
            id: 2,
            name: 'Productblocks',
            path: '/metadata/productblocks',
        },
        {
            id: 3,
            name: 'Resource types',
            path: '/metadata/resource-types',
        },
        {
            id: 4,
            name: 'Products',
            path: '/metadata/fixed-inputs',
        },
        {
            id: 5,
            name: 'Products',
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
