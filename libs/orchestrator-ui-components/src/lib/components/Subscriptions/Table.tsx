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
    rowHover: 'highlight',
    header: 'underline',
    cellPadding: 'm',
    fontSize: 'm',
    footer: 'overline',
};

export type TableProps<T> = {
    tableColumns: EuiDataGridColumn[];
    tableData: T[];
};

export const Table = <T,>({ tableColumns, tableData }: TableProps<T>) => {
    const [visibleColumns, setVisibleColumns] = useState(
        tableColumns.map(({ id }) => id),
    );

    const renderCellValue = ({
        rowIndex,
        columnId,
        schema,
    }: EuiDataGridCellValueElementProps) => {
        const dataRow = tableData[0];
        const cell = dataRow[columnId as keyof T];
        return `${rowIndex} / ${columnId}: ${cell}`;
    };

    return (
        <>
            <h1>Hello subscriptions</h1>
            <EuiDataGrid
                aria-label="Data Grid"
                columns={tableColumns}
                height={'calc(100vh - 115px)'}
                gridStyle={GRID_STYLE}
                columnVisibility={{ visibleColumns, setVisibleColumns }}
                rowCount={tableData.length}
                renderCellValue={renderCellValue}
            />
        </>
    );
};
