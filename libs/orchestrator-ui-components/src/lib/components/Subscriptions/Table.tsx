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
    rowHover: 'highlight', // todo try to fix color
    header: 'shade',
    cellPadding: 'l',
    fontSize: 'm',
    footer: 'overline',
};

export type TableColumns<T> = {
    [Property in keyof T]: Omit<EuiDataGridColumn, 'id'> & {
        renderCell?: (cellValue: T[Property]) => ReactNode;
    };
};

// When optional, the table does not render the undefined columns -- still would be nice to prevent users defining {} for every column
// export type TableColumns<T> = {
//     [Property in keyof T]?: Omit<EuiDataGridColumn, 'id'> & {
//         renderCell?: (cellValue: T[Property]) => ReactNode;
//     };
// };

export type TableProps<T> = {
    data: T[];
    columns: TableColumns<T>;
    columnVisibility: Array<keyof TableColumns<T>>;
    handleRowClick?: (row: T) => void;
};

export const Table = <T,>({
    data,
    columns,
    columnVisibility,
    handleRowClick,
}: TableProps<T>) => {
    const euiCols: EuiDataGridColumn[] = Object.keys(columns).map((colKey) => {
        const column = columns[colKey as keyof T];
        return {
            id: colKey,
            isExpandable: false,
            ...column,
        };
    });

    // Todo dragging columns around in the dropdown makes the view snap back to its previous state
    const [visibleColumns, setVisibleColumns] = useState(
        columnVisibility.map((columnId) => columnId.toString()),
    );

    const renderCellValue = ({
        rowIndex,
        columnId,
        schema,
        setCellProps,
    }: EuiDataGridCellValueElementProps) => {
        const dataRow = data[rowIndex];
        const column = columns[columnId as keyof T];

        const cellValue = dataRow[columnId as keyof T];

        setCellProps({
            css: { cursor: 'pointer' },
            onClick: () => handleRowClick && handleRowClick(dataRow),
        });

        // Used together with the optional column prop, see commented code above
        if (!column) {
            return;
        }

        if (!column.renderCell) {
            return `${cellValue}`;
        }

        return column.renderCell(cellValue);
    };

    // Todo implement
    // - sort props
    // - pagination
    return (
        <EuiDataGrid
            aria-label="Data Grid"
            columns={euiCols}
            height={'calc(100vh - 115px)'}
            gridStyle={GRID_STYLE}
            columnVisibility={{ visibleColumns, setVisibleColumns }}
            sorting={{
                columns: [],
                onSort: (sortData) => console.log('Sorting', { sortData }),
            }}
            rowCount={data.length}
            renderCellValue={renderCellValue}
        />
    );
};
