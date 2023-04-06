// Todo: issue on Eui's Github: https://github.com/elastic/eui/issues/6616
import 'regenerator-runtime/runtime';

import {
    EuiDataGrid,
    EuiDataGridCellValueElementProps,
    EuiDataGridColumn,
    EuiDataGridStyle,
} from '@elastic/eui';
import { useState } from 'react';

const GRID_STYLE: EuiDataGridStyle = {
    border: 'horizontal',
    stripes: false,
    rowHover: 'none',
    header: 'underline',
    cellPadding: 'm',
    fontSize: 'm',
    footer: 'overline',
};

export type TableColumns<T> = Record<keyof T, Omit<EuiDataGridColumn, 'id'>>;

export type TableProps<T> = {
    columns: TableColumns<T>;
    data: T[];
};

export const Table = <T,>({ columns, data }: TableProps<T>) => {
    const euiCols: EuiDataGridColumn[] = Object.keys(columns).map((colKey) => {
        const column = columns[colKey as keyof T];
        return {
            id: colKey,
            ...column,
        };
    });

    const [visibleColumns, setVisibleColumns] = useState(
        euiCols.map(({ id }) => id),
    );

    const renderCellValue = ({
        rowIndex,
        columnId,
        schema,
    }: EuiDataGridCellValueElementProps) => {
        const dataRow = data[rowIndex];
        const cellValue = dataRow[columnId as keyof T];
        return `${cellValue}`;
    };

    return (
        <>
            <h1>Hello subscriptions</h1>
            <EuiDataGrid
                aria-label="Data Grid"
                columns={euiCols}
                height={'calc(100vh - 115px)'}
                gridStyle={GRID_STYLE}
                columnVisibility={{ visibleColumns, setVisibleColumns }}
                rowCount={data.length}
                renderCellValue={renderCellValue}
            />
        </>
    );
};
