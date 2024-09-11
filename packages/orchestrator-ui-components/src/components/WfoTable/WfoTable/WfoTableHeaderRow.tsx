import React from 'react';

import { useWithOrchestratorTheme } from '@/hooks';
import { toOptionalArrayEntry } from '@/utils';

import { ColumnType, WfoTableProps } from './WfoTable';
import { WfoTableHeaderCell } from './WfoTableHeaderCell';
import { getWfoTableStyles } from './styles';
import { getSortedVisibleColumns } from './utils';

export type WfoTableHeaderRowProps<T extends object> = Pick<
    WfoTableProps<T>,
    | 'columnConfig'
    | 'hiddenColumns'
    | 'columnOrder'
    | 'dataSorting'
    | 'onUpdateDataSorting'
    | 'onUpdateDataSearch'
    | 'className'
>;

export const WfoTableHeaderRow = <T extends object>({
    columnConfig,
    columnOrder = [],
    hiddenColumns = [],
    dataSorting = [],
    onUpdateDataSorting,
    onUpdateDataSearch,
    className,
}: WfoTableHeaderRowProps<T>) => {
    const { cellStyle, rowStyle, setWidth } =
        useWithOrchestratorTheme(getWfoTableStyles);

    const sortedVisibleColumns = getSortedVisibleColumns(
        columnConfig,
        columnOrder,
        hiddenColumns,
    );

    return (
        <>
            <tr className={className} css={rowStyle}>
                {sortedVisibleColumns.map(([key, columnConfig]) => {
                    const dataSortingConfiguration = dataSorting.find(
                        (dataSorting) => dataSorting.field === key,
                    );

                    if (columnConfig.columnType === ColumnType.DATA) {
                        return (
                            <th
                                colSpan={columnConfig.numberOfColumnsToSpan}
                                key={key}
                                css={[
                                    ...toOptionalArrayEntry(
                                        cellStyle,
                                        !columnConfig.disableDefaultCellStyle,
                                    ),
                                    setWidth(columnConfig.width),
                                ]}
                            >
                                <WfoTableHeaderCell
                                    fieldName={key}
                                    sortOrder={
                                        dataSortingConfiguration?.sortOrder
                                    }
                                    onSetSortOrder={
                                        columnConfig.isSortable
                                            ? (updatedSortOrder) =>
                                                  onUpdateDataSorting?.({
                                                      // Currently there is not a good way to tell Typescript that in some cases
                                                      // key is of type "keyof T"
                                                      field: key as keyof T,
                                                      sortOrder:
                                                          updatedSortOrder,
                                                  })
                                            : undefined
                                    }
                                    onSearch={
                                        columnConfig.isFilterable
                                            ? (searchText) =>
                                                  onUpdateDataSearch?.({
                                                      field: key as keyof T,
                                                      searchText,
                                                  })
                                            : undefined
                                    }
                                >
                                    {columnConfig.label?.toString()}
                                </WfoTableHeaderCell>
                            </th>
                        );
                    }

                    // Control column
                    return (
                        <th
                            key={key}
                            colSpan={columnConfig.numberOfColumnsToSpan}
                            css={[
                                ...toOptionalArrayEntry(
                                    cellStyle,
                                    !columnConfig.disableDefaultCellStyle,
                                ),
                                setWidth(columnConfig.width),
                            ]}
                        >
                            <div>{columnConfig.label?.toString() || ''}</div>
                        </th>
                    );
                })}
            </tr>
        </>
    );
};
