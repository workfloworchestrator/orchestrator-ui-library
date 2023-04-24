// Todo: issue on Eui's Github: https://github.com/elastic/eui/issues/6616
import 'regenerator-runtime/runtime';

import {
    EuiDataGrid,
    EuiDataGridCellValueElementProps,
    EuiDataGridColumn,
    EuiDataGridStyle,
} from '@elastic/eui';
import { ReactNode, useRef, useState } from 'react';

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
        isHiddenByDefault?: boolean;
    };
};

export type TableProps<T> = {
    data: T[];
    columns: TableColumns<T>;
    initialColumnOrder: Array<keyof TableColumns<T>>;
    handleRowClick?: (row: T) => void;
};

export const Table = <T,>({
    data,
    columns,
    initialColumnOrder,
    handleRowClick,
}: TableProps<T>) => {
    const initialColumnOrderRef = useRef(
        getInitialColumnOrder(columns, initialColumnOrder),
    );

    const defaultVisibleColumns: string[] = initialColumnOrder
        .filter((columnId) => !columns[columnId].isHiddenByDefault)
        .map((columnId) => columnId.toString());
    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

    const renderCellValue = ({
        rowIndex,
        columnId,
        setCellProps,
    }: EuiDataGridCellValueElementProps) => {
        const dataRow = data[rowIndex];
        const column = columns[columnId as keyof T];

        const cellValue = dataRow[columnId as keyof T];

        setCellProps({
            css: { cursor: 'pointer' },
            onClick: () => handleRowClick && handleRowClick(dataRow),
        });

        return column.renderCell
            ? column.renderCell(cellValue)
            : `${cellValue}`;
    };

    // Todo implement
    // - sort props
    // - pagination
    return (
        <EuiDataGrid
            aria-label="Data Grid"
            columns={initialColumnOrderRef.current}
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

function getInitialColumnOrder<T>(
    columns: TableColumns<T>,
    initialColumnOrder: Array<keyof TableColumns<T>>,
) {
    const euiDataGridColumns: EuiDataGridColumn[] = Object.keys(columns).map(
        (colKey) => {
            const column = columns[colKey as keyof T];
            return {
                id: colKey,
                isExpandable: false,
                ...column,
            };
        },
    );
    const columnOrderIds = initialColumnOrder.map((columnId) =>
        columnId.toString(),
    );
    return euiDataGridColumns
        .slice()
        .sort(
            (left, right) =>
                columnOrderIds.indexOf(left.id) -
                columnOrderIds.indexOf(right.id),
        );
}
