import React, { useRef } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';
import { toOptionalArrayEntry } from '@/utils';

import { WfoDragHandler } from './WfoDragHandler';
import { ColumnType, WfoTableProps } from './WfoTable';
import { WfoTableHeaderCell } from './WfoTableHeaderCell';
import { getWfoTableStyles } from './styles';
import { getSortedVisibleColumns } from './utils';

export type onUpdateColumWidth = (fieldName: string, width: number) => void;

export type WfoTableHeaderRowProps<T extends object> = Pick<
    WfoTableProps<T>,
    | 'columnConfig'
    | 'hiddenColumns'
    | 'columnOrder'
    | 'dataSorting'
    | 'onUpdateDataSorting'
    | 'onUpdateDataSearch'
    | 'className'
> & {
    onUpdateColumWidth?: onUpdateColumWidth;
};

export const WfoTableHeaderRow = <T extends object>({
    columnConfig,
    columnOrder = [],
    hiddenColumns = [],
    dataSorting = [],
    onUpdateDataSorting,
    onUpdateDataSearch,
    onUpdateColumWidth,
    className,
}: WfoTableHeaderRowProps<T>) => {
    const {
        cellStyle,
        headerCellContainer,
        sortableHeaderCellStyle,
        rowStyle,
        setWidth,
    } = useWithOrchestratorTheme(getWfoTableStyles);

    const sortedVisibleColumns = getSortedVisibleColumns(
        columnConfig,
        columnOrder,
        hiddenColumns,
    );
    const headerRowRef = useRef<HTMLTableRowElement>(null);
    return (
        <tr className={className} css={rowStyle} ref={headerRowRef}>
            {sortedVisibleColumns.map(([fieldName, columnConfig], index) => {
                const dataSortingConfiguration = dataSorting.find(
                    (dataSorting) => dataSorting.field === fieldName,
                );

                if (columnConfig.columnType === ColumnType.DATA) {
                    return (
                        <th
                            colSpan={columnConfig.numberOfColumnsToSpan}
                            key={fieldName}
                            data-field-name={fieldName}
                            css={[
                                ...toOptionalArrayEntry(
                                    cellStyle,
                                    !columnConfig.disableDefaultCellStyle,
                                ),
                                ...toOptionalArrayEntry(
                                    sortableHeaderCellStyle,
                                    !!columnConfig.isSortable,
                                ),
                                setWidth(columnConfig.width),
                            ]}
                        >
                            <div css={headerCellContainer}>
                                <WfoTableHeaderCell
                                    fieldName={fieldName}
                                    sortOrder={
                                        dataSortingConfiguration?.sortOrder
                                    }
                                    onSetSortOrder={
                                        columnConfig.isSortable
                                            ? (updatedSortOrder) =>
                                                  onUpdateDataSorting?.({
                                                      // Currently there is not a good way to tell Typescript that in some cases
                                                      // key is of type "keyof T"
                                                      field: fieldName as keyof T,
                                                      sortOrder:
                                                          updatedSortOrder,
                                                  })
                                            : undefined
                                    }
                                    onSearch={
                                        columnConfig.isFilterable
                                            ? (searchText) =>
                                                  onUpdateDataSearch?.({
                                                      field: fieldName as keyof T,
                                                      searchText,
                                                  })
                                            : undefined
                                    }
                                >
                                    {columnConfig.label?.toString()}
                                </WfoTableHeaderCell>
                                {typeof onUpdateColumWidth === 'function' &&
                                    index !==
                                        sortedVisibleColumns.length - 1 && (
                                        <WfoDragHandler
                                            headerRowRef={headerRowRef}
                                            fieldName={fieldName}
                                            onUpdateColumWidth={
                                                onUpdateColumWidth
                                            }
                                        />
                                    )}
                            </div>
                        </th>
                    );
                }

                // Control column
                return (
                    <th
                        key={fieldName}
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
    );
};
