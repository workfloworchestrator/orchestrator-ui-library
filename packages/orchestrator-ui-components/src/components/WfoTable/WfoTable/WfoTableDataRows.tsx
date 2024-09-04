import React, { Fragment } from 'react';

import { useWithOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

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
    const { cellStyle, rowStyle, dataRowStyle, clickableStyle, setWidth } =
        useWithOrchestratorTheme(getWfoTableStyles);

    const sortedVisibleColumns = getSortedVisibleColumns(
        columnConfig,
        columnOrder,
        hiddenColumns,
    );

    return data.map((row, index) => (
        <Fragment key={`table-data-row-${index}`}>
            <tr
                className={className}
                css={[rowStyle, dataRowStyle, onRowClick && clickableStyle]}
                onClick={() => onRowClick?.(row)}
            >
                {sortedVisibleColumns.map(([key, columnConfig]) => {
                    if (columnConfig.columnType === ColumnType.CONTROL) {
                        return (
                            <td
                                colSpan={
                                    columnConfig.numberOfColumnsToSpan ?? 1
                                }
                                key={key}
                                css={[cellStyle, setWidth(columnConfig.width)]}
                            >
                                <div>{columnConfig.renderControl(row)}</div>
                            </td>
                        );
                    }

                    // Currently there is not a good way to tell Typescript that in some cases
                    // key is of type "keyof T"
                    const result = row[key as keyof T];
                    return (
                        <td
                            key={key}
                            css={[cellStyle, setWidth(columnConfig.width)]}
                        >
                            <div>
                                {columnConfig.renderData?.(result, row) ??
                                    result?.toString()}
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
    ));
};
