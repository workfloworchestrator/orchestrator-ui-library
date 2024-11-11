import React, { FC } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import type { StepState } from '@/types';

import { WfoKeyValueTable } from '../WfoKeyValueTable';
import type { WfoKeyValueTableDataType } from '../WfoKeyValueTable';
import { getStyles } from './styles';

export type WfoTableCodeBlockProps = {
    data: StepState;
};

export const WfoTableCodeBlock: FC<WfoTableCodeBlockProps> = ({ data }) => {
    const { tableCodeBlockMarginStyle } = useWithOrchestratorTheme(getStyles);

    const keyValues: WfoKeyValueTableDataType[] = Object.entries(data).map(
        (entry) => {
            const key = entry[0];
            const value = entry[1] as string;

            return {
                key,
                value,
                textToCopy: value,
            };
        },
    );

    return (
        <EuiFlexItem css={tableCodeBlockMarginStyle}>
            <WfoKeyValueTable
                keyValues={keyValues}
                showCopyToClipboardIcon={true}
            />
        </EuiFlexItem>
    );
};
