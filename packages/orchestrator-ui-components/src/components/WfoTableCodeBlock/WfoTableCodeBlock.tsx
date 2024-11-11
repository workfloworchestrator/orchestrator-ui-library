import React, { FC } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { WfoKeyValueTable } from '../WfoKeyValueTable';
import type { WfoKeyValueTableDataType } from '../WfoKeyValueTable';
import { getStyles } from './styles';

export type WfoTableCodeBlockProps = {
    data: object;
};

export const WfoTableCodeBlock: FC<WfoTableCodeBlockProps> = ({ data }) => {
    console.log(data);

    const { tableCodeBlockMarginStyle } = useWithOrchestratorTheme(getStyles);

    const keyValues: WfoKeyValueTableDataType[] = [
        { key: 'key1', value: 'value1', textToCopy: 'textToCopy1' },
        { key: 'key2', value: 'value2' },
    ];

    return (
        <EuiFlexItem css={tableCodeBlockMarginStyle}>
            <WfoKeyValueTable
                keyValues={keyValues}
                showCopyToClipboardIcon={true}
            />
        </EuiFlexItem>
    );
};
