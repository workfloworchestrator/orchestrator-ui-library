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
                {subtitle && (
                    <div>
                        <EuiSpacer size="m" />
                        <WfoRenderElementOrString>
                            {subtitle}
                        </WfoRenderElementOrString>
                    </div>
                )}
            </EuiFlexItem>

            {children && (
                <EuiFlexItem grow={0}>
                    <EuiFlexGroup
                        justifyContent="flexEnd"
                        alignItems="flexStart"
                    >
                        <WfoRenderElementOrString>
                            {children}
                        </WfoRenderElementOrString>
                    </EuiFlexGroup>
                </EuiFlexItem>
            )}
        </EuiFlexGroup>

        <EuiSpacer size="l" />
    </>
);
