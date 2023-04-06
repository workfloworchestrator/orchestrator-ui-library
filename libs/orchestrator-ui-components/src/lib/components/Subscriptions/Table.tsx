// Todo: issue on Eui's Github: https://github.com/elastic/eui/issues/6616
import 'regenerator-runtime/runtime';

import {
    EuiDataGrid,
    EuiDataGridCellValueElementProps,
    EuiDataGridColumn,
    EuiDataGridStyle,
} from '@elastic/eui';
import { ReactNode, useState } from 'react';

const GRID_STYLE: EuiDataGridStyle = {
    border: 'horizontal',
    stripes: false,
    rowHover: 'none',
    header: 'underline',
    cellPadding: 'm',
    fontSize: 'm',
    footer: 'overline',
};

export type TableColumns<T> = {
    [Property in keyof T]: Omit<EuiDataGridColumn, 'id'> & {
        renderCell?: (cellValue: T[Property]) => ReactNode;
    };
};

// When optional the table does not render the undefined columns -- might be nice to leverage that
// export type TableColumns<T> = {
//     [Property in keyof T]?: Omit<EuiDataGridColumn, 'id'> & {
//         renderCell?: (cellValue: T[Property]) => ReactNode;
//     };
// };

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
        const column = columns[columnId as keyof T];

        const cellValue = dataRow[columnId as keyof T];

        // Used together with the optional column prop
        if (!column) {
            return;
        }

        if (!column.renderCell) {
            return `${cellValue}`;
        }

        return column.renderCell(cellValue);
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
