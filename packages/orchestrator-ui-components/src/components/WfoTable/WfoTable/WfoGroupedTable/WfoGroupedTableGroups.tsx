import React, { Ref, useImperativeHandle } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';

import { WfoTableDataRows } from '../WfoTableDataRows';
import { getWfoTableStyles } from '../styles';
import { WfoGroupedTableProps } from './WfoGroupedTable';
import { getWfoGroupedTableStyles } from './styles';
import { useGroupedTableConfig } from './useGroupedTableConfig';

export type WfoGroupedTableGroupsRef = {
  expandAllRows: () => void;
};

export type WfoGroupedTableGroupsProps<T extends object> = Pick<
  WfoGroupedTableProps<T>,
  'columnConfig' | 'data' | 'groupNameLabel'
> & {
  nestingLevel?: number;
  onExpandRowChange: (isAllExpanded: boolean) => void;
};

export const WfoGroupedTableGroups = React.forwardRef(
  <T extends object>(
    { data, groupNameLabel, columnConfig, nestingLevel = 1, onExpandRowChange }: WfoGroupedTableGroupsProps<T>,
    reference: Ref<WfoGroupedTableGroupsRef>,
  ) => {
    const { expandedRowStyle } = useWithOrchestratorTheme(getWfoTableStyles);
    const { getNestingStyle } = useWithOrchestratorTheme(getWfoGroupedTableStyles);

    const { groups, groupColumnConfig, uniqueRowIdToExpandedRowMap, toggleExpandedRow, expandAllRows } =
      useGroupedTableConfig({
        data,
        groupNameLabel,
        columnConfig,
        nestingLevel,
        notifyParent: onExpandRowChange,
      });

    useImperativeHandle(reference, () => ({
      expandAllRows: () => {
        expandAllRows();
      },
    }));

    return (
      <WfoTableDataRows
        css={[expandedRowStyle, getNestingStyle(nestingLevel)]}
        data={groups}
        columnConfig={groupColumnConfig}
        onRowClick={(row) => toggleExpandedRow(row.groupName)}
        rowExpandingConfiguration={{
          uniqueRowId: 'groupName',
          uniqueRowIdToExpandedRowMap,
        }}
      />
    );
  },
);
WfoGroupedTableGroups.displayName = 'WfoGroupedTableGroups';
