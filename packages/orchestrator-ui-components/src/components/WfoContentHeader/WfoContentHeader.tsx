import React, { FC, ReactElement } from 'react';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';

import { WfoRenderElementOrString } from '@/components';

export type WfoContentHeaderProps = {
    title: ReactElement | string;
    subtitle?: ReactElement | string;
    children?: ReactElement | ReactElement[] | string;
};

export const WfoContentHeader: FC<WfoContentHeaderProps> = ({
    title,
    subtitle,
    children,
}) => (
    <>
        <EuiFlexGroup>
            <EuiFlexItem>
                <WfoRenderElementOrString
                    renderString={(value) => (
                        <EuiPageHeader pageTitle={value} />
                    )}
                >
                    {title}
                </WfoRenderElementOrString>
            </EuiFlexItem>

            {children && (
                <EuiFlexItem>
                    <EuiFlexGroup justifyContent="flexEnd">
                        <WfoRenderElementOrString>
                            {children}
                        </WfoRenderElementOrString>
                    </EuiFlexGroup>
                </EuiFlexItem>
            )}
        </EuiFlexGroup>

        {subtitle && (
            <>
                <EuiSpacer size="m" />
                <WfoRenderElementOrString>{subtitle}</WfoRenderElementOrString>
            </>
        )}

        <EuiSpacer size="l" />
    </>
);
