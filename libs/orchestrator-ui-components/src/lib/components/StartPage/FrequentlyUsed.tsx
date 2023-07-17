import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import React, { FC } from 'react';

export interface FrequentlyUsedProps {
    values: string[];
}

export const FrequentlyUsed: FC<FrequentlyUsedProps> = ({ values }) => (
    <EuiFlexGroup wrap gutterSize="m">
        {values.map((value, index) => (
            <EuiFlexItem key={index} grow={false}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-ignore "xs" size is not assignable to EuiButton, but is possible to assign it forcefully*/}
                <EuiButton size="xs" style={{ minWidth: 0 }}>
                    {value}
                </EuiButton>
            </EuiFlexItem>
        ))}
    </EuiFlexGroup>
);
