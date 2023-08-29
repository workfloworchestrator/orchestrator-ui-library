import React, { FC, ReactNode } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiPageHeader } from '@elastic/eui';

export type WFOPageHeaderProps = {
    pageTitle: string;
    children?: ReactNode;
};

export const WFOPageHeader: FC<WFOPageHeaderProps> = ({
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
