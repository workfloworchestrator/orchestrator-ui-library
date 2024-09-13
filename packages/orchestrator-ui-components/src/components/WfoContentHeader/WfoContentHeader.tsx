import React, { FC, ReactNode } from 'react';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';

// WfoPageTitle
export type WfoContentTitleProps = {
    children: string | ReactNode;
};
export const WfoContentTitle: FC<WfoContentTitleProps> = ({ children }) => {
    if (typeof children === 'string') {
        return <EuiPageHeader pageTitle={children} />;
    }

    return children;
};

// WfoPageSubtitle
export const WfoContentSubtitle: FC<WfoContentTitleProps> = ({ children }) => {
    if (typeof children === 'string') {
        return null; // todo
    }

    return children;
};

//////////

export type WfoContentHeaderProps = {
    title: string | ReactNode;
    subtitle?: string | ReactNode;
    children?: ReactNode;
};

export const WfoContentHeader: FC<WfoContentHeaderProps> = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <WfoContentTitle>{title}</WfoContentTitle>
                </EuiFlexItem>

                {children && (
                    <EuiFlexItem>
                        <EuiFlexGroup justifyContent="flexEnd">
                            {children}
                        </EuiFlexGroup>
                    </EuiFlexItem>
                )}
            </EuiFlexGroup>

            {subtitle && (
                <>
                    <EuiSpacer size="m" />
                    {subtitle}
                </>
            )}

            <EuiSpacer size="l" />
        </>
    );
};
