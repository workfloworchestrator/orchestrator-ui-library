import React from 'react';

import { EuiSkeletonText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { toOptionalArrayEntry } from '@/utils';

import { ColumnType, WfoTableProps } from './WfoTable';
import { getWfoTableStyles } from './styles';
import { getSortedVisibleColumns } from './utils';

export type WfoTableSkeletonRowsProps<T extends object> = Pick<
  WfoTableProps<T>,
  'columnConfig' | 'hiddenColumns' | 'columnOrder'
> & {
  rowCount: number;
};

export const WfoTableSkeletonRows = <T extends object>({
  rowCount,
  columnConfig,
  hiddenColumns = [],
  columnOrder = [],
}: WfoTableSkeletonRowsProps<T>) => {
  const { cellStyle, cellContentStyle, rowStyle, setWidth } = useWithOrchestratorTheme(getWfoTableStyles);

  const sortedVisibleColumns = getSortedVisibleColumns(columnConfig, columnOrder, hiddenColumns);

  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`} css={rowStyle}>
          {sortedVisibleColumns.map(([key, columnConfig]) => (
            <td
              key={key}
              css={[
                ...toOptionalArrayEntry(cellStyle, !columnConfig.disableDefaultCellStyle),
                setWidth(columnConfig.width),
              ]}
            >
              {columnConfig.columnType === ColumnType.DATA && (
                <div css={cellContentStyle}>
                  <EuiSkeletonText lines={1} size="m" isLoading />
                </div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
