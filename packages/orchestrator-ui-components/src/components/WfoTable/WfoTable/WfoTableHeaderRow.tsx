import React, { useRef } from 'react';

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
> & {
    onUpdateColumWidth?: (fieldName: string, width: number) => void;
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
        dragAndDropStyle,
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
            {sortedVisibleColumns.map(([fieldName, columnConfig]) => {
                const dataSortingConfiguration = dataSorting.find(
                    (dataSorting) => dataSorting.field === fieldName,
                );
                let startDragPosition = 0;
                let startWidth = 0;

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
                                {onUpdateColumWidth && (
                                    <div
                                        css={dragAndDropStyle}
                                        draggable={true}
                                        onDragStart={(e) => {
                                            startDragPosition = e.clientX;
                                            if (headerRowRef.current) {
                                                const thElement =
                                                    headerRowRef.current.querySelector(
                                                        `th[data-field-name="${fieldName}"]`,
                                                    ) as HTMLTableCellElement;
                                                startWidth =
                                                    thElement.getBoundingClientRect()
                                                        .width;
                                            }
                                        }}
                                        onDragEnd={(e) => {
                                            if (
                                                headerRowRef.current &&
                                                onUpdateColumWidth
                                            ) {
                                                const travel =
                                                    e.clientX -
                                                    startDragPosition;
                                                const newWidth =
                                                    startWidth + travel;

                                                onUpdateColumWidth(
                                                    fieldName,
                                                    newWidth,
                                                );
                                            }
                                        }}
                                    >
                                        &nbsp;
                                    </div>
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
