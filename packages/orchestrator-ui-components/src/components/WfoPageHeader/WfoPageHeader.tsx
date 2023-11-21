import React, { FC, ReactNode } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPageHeader } from '@elastic/eui';

export type WfoPageHeaderProps = {
    pageTitle: string;
    children?: ReactNode;
};

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
    pageTitle,
    children,
}) => (
    <EuiFlexGroup>
        <EuiFlexItem>
            <EuiPageHeader pageTitle={pageTitle}></EuiPageHeader>
        </EuiFlexItem>

        {children && (
            <EuiFlexItem>
                <EuiFlexGroup justifyContent="flexEnd">{children}</EuiFlexGroup>
            </EuiFlexItem>
        )}
    </EuiFlexGroup>
);
