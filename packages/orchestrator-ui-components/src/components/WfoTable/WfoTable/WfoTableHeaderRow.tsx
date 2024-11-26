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

    return (
        <>
            <tr className={className} css={rowStyle}>
                {sortedVisibleColumns.map(([key, columnConfig]) => {
                    const dataSortingConfiguration = dataSorting.find(
                        (dataSorting) => dataSorting.field === key,
                    );
                    let startPosition = 0;

                    if (columnConfig.columnType === ColumnType.DATA) {
                        const headerCellRef =
                            useRef<HTMLTableCellElement>(null);

                        return (
                            <th
                                colSpan={columnConfig.numberOfColumnsToSpan}
                                key={key}
                                ref={headerCellRef}
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
                                    <div
                                        css={dragAndDropStyle}
                                        draggable={true}
                                        onDragStart={(e) => {
                                            startPosition = e.clientX;
                                            console.log(
                                                `startPosition: ${startPosition}`,
                                            );
                                        }}
                                        onDragEnd={(e) => {
                                            if (headerCellRef.current) {
                                                const boundingRect =
                                                    headerCellRef.current.getBoundingClientRect();
                                                const width =
                                                    boundingRect.width;
                                                const travel =
                                                    e.clientX - startPosition;
                                                const newWidth = width + travel;
                                                console.log(newWidth);
                                            }
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                </div>
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
