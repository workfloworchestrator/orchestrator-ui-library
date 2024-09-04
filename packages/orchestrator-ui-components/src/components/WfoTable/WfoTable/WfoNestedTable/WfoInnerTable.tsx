import React from 'react';

import { useWithOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { WfoTable, WfoTableProps } from '../WfoTable';
import { WfoTdFullWidth } from './WfoTdFullWidth';
import { getWfoNestedTableStyles } from './styles';

export type WfoInnerTableProps<T extends object> = Pick<
    WfoTableProps<T>,
    'data' | 'columnConfig' | 'isLoading'
>;

export const WfoInnerTable = <T extends object>({
    data,
    columnConfig,
    isLoading,
}: WfoInnerTableProps<T>) => {
    const { innerTableStyle } = useWithOrchestratorTheme(
        getWfoNestedTableStyles,
    );

    return (
        <tr>
            <WfoTdFullWidth>
                <WfoTable
                    data={data}
                    columnConfig={columnConfig}
                    isLoading={isLoading}
                    css={innerTableStyle}
                />
            </WfoTdFullWidth>
        </tr>
    );
};
