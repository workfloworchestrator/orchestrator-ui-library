import React, { Fragment } from 'react';

import { WfoDataCell } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { toOptionalArrayEntry } from '@/utils';

import { WfoExpandedRow } from './WfoExpandedRow';
import { ColumnType, WfoTableProps } from './WfoTable';
import { getWfoTableStyles } from './styles';
import { getSortedVisibleColumns } from './utils';

export type WfoTableDataRowsProps<T extends object> = Pick<
    WfoTableProps<T>,
    | 'data'
    | 'columnConfig'
    | 'hiddenColumns'
    | 'columnOrder'
    | 'rowExpandingConfiguration'
    | 'onRowClick'
    | 'className'
>;

export const WfoTableDataRows = <T extends object>({
    data,
    columnConfig,
    hiddenColumns = [],
    columnOrder = [],
    rowExpandingConfiguration,
    onRowClick,
    className,
}: WfoTableDataRowsProps<T>) => {
    const {
        cellStyle,
        cellContentStyle,
        rowStyle,
        dataRowStyle,
        clickableStyle,
        setWidth,
    } = useWithOrchestratorTheme(getWfoTableStyles);

    const sortedVisibleColumns = getSortedVisibleColumns(
        columnConfig,
        columnOrder,
        hiddenColumns,
    );

    return (
        <>
            {data.map((row, index) => (
                <Fragment key={`table-data-row-${index}`}>
                    <tr
                        className={`${className} data-row`}
                        css={[
                            rowStyle,
                            dataRowStyle,
                            onRowClick && clickableStyle,
                        ]}
                        onClick={() => onRowClick?.(row)}
                    >
                        {sortedVisibleColumns.map(([key, columnConfig]) => {
                            if (
                                columnConfig.columnType === ColumnType.CONTROL
                            ) {
                                return (
                                    <td
                                        className="control-cell"
                                        colSpan={
                                            columnConfig.numberOfColumnsToSpan ??
                                            1
                                        }
                                        key={key}
                                        css={[
                                            ...toOptionalArrayEntry(
                                                cellStyle,
                                                !columnConfig.disableDefaultCellStyle,
                                            ),
                                            setWidth(columnConfig.width),
                                        ]}
                                    >
                                        <div css={cellContentStyle}>
                                            {columnConfig.renderControl(row)}
                                        </div>
                                    </td>
                                );
                            }

                            // Currently there is not a good way to tell Typescript that in some cases
                            // key is of type "keyof T"
                            const result = row[key as keyof T];
                            return (
                                <td
                                    className="data-cell"
                                    key={key}
                                    css={[
                                        ...toOptionalArrayEntry(
                                            cellStyle,
                                            !columnConfig.disableDefaultCellStyle,
                                        ),
                                        setWidth(columnConfig.width),
                                    ]}
                                >
                                    <div css={cellContentStyle}>
                                        <WfoDataCell
                                            customTooltip={columnConfig.renderTooltip?.(
                                                result,
                                                row,
                                            )}
                                        >
                                            {columnConfig.renderData?.(
                                                result,
                                                row,
                                            ) ?? result?.toString()}
                                        </WfoDataCell>
                                    </div>
                                </td>
                            );
                        })}
                    </tr>

                    <WfoExpandedRow
                        rowExpandingConfiguration={rowExpandingConfiguration}
                        rowData={row}
                    />
                </Fragment>
            ))}
        </>
    );
};
