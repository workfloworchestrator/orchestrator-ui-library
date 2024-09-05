import React, { Ref } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';

import { WfoTableDataRows } from '../WfoTableDataRows';
import { WfoTableHeaderRow } from '../WfoTableHeaderRow';
import { getWfoTableStyles } from '../styles';
import { GroupedData } from './WfoGroupedTable';
import {
    WfoGroupedTableGroups,
    WfoGroupedTableGroupsProps,
    WfoGroupedTableGroupsRef,
} from './WfoGroupedTableGroups';
import { getWfoGroupedTableStyles } from './styles';

export type WfoExpandedGroupRowProps<T extends object> = Pick<
    WfoGroupedTableGroupsProps<T>,
    'columnConfig' | 'nestingLevel' | 'groupNameLabel'
> & {
    data: GroupedData<T> | T[];
    onExpandRowChange: (isAllExpanded: boolean) => void;
};

export const WfoExpandedGroupRow = React.forwardRef(
    <T extends object>(
        {
            data,
            columnConfig,
            nestingLevel = 1,
            groupNameLabel,
            onExpandRowChange,
        }: WfoExpandedGroupRowProps<T>,
        reference: Ref<WfoGroupedTableGroupsRef>,
    ) => {
        const { expandedRowStyle } =
            useWithOrchestratorTheme(getWfoTableStyles);
        const { innerTableHeaderStyle, getNestingStyle } =
            useWithOrchestratorTheme(getWfoGroupedTableStyles);

        if (Array.isArray(data)) {
            return (
                <>
                    <WfoTableHeaderRow
                        css={[
                            innerTableHeaderStyle,
                            getNestingStyle(nestingLevel),
                        ]}
                        columnConfig={columnConfig}
                    />
                    <WfoTableDataRows
                        css={[expandedRowStyle, getNestingStyle(nestingLevel)]}
                        data={data}
                        columnConfig={columnConfig}
                    />
                </>
            );
        }

        return (
            <WfoGroupedTableGroups
                ref={reference}
                data={data}
                columnConfig={columnConfig}
                groupNameLabel={groupNameLabel}
                nestingLevel={nestingLevel}
                onExpandRowChange={onExpandRowChange}
            />
        );
    },
);
WfoExpandedGroupRow.displayName = 'WfoExpandedGroupRow';
