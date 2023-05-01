// Todo: issue on Eui's Github: https://github.com/elastic/eui/issues/6616
import 'regenerator-runtime/runtime';

import {
    EuiDataGrid,
    EuiDataGridCellValueElementProps,
    EuiDataGridStyle,
} from '@elastic/eui';
import { useRef, useState } from 'react';
import {
    columnSortToEuiDataGridSorting,
    DataSorting,
    getInitialColumnOrder,
    TableColumns,
} from './columns';
import { EuiDataGridPaginationProps } from '@elastic/eui/src/components/datagrid/data_grid_types';

// Total height of grid button bar, table header and pagination bar
const EUI_DATA_GRID_HEIGHT_OFFSET = 103;

const GRID_STYLE: EuiDataGridStyle = {
    border: 'horizontal',
    stripes: false,
    rowHover: 'highlight',
    header: 'shade',
    cellPadding: 'l',
    fontSize: 'm',
    footer: 'overline',
};

export type Pagination = EuiDataGridPaginationProps & {
    totalRecords: number;
};

export type TableProps<T> = {
    data: T[];
    pagination: Pagination;
    columns: TableColumns<T>;
    initialColumnOrder: Array<keyof T>;
    dataSorting?: DataSorting<T>;
    handleRowClick?: (row: T) => void;
    updateDataSorting?: (updatedDataSorting: DataSorting<T>) => void;
};

export const Table = <T,>({
    data,
    pagination,
    columns,
    initialColumnOrder,
    dataSorting,
    handleRowClick,
    updateDataSorting,
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
        const { pageSize, pageIndex } = pagination;
        const rowIndexOnPage = rowIndex - pageIndex * pageSize;

        const dataRow = data[rowIndexOnPage];
        if (!dataRow) {
            return;
        }

        const column = columns[columnId as keyof T];
        const cellValue = dataRow[columnId as keyof T];

        handleRowClick &&
            setCellProps({
                css: { cursor: 'pointer' },
                onClick: () => handleRowClick(dataRow),
            });

        return column.renderCell
            ? column.renderCell(cellValue, dataRow)
            : `${cellValue}`;
    };

    const gridHeight = `${
        pagination.pageSize * 40 + EUI_DATA_GRID_HEIGHT_OFFSET
    }px`;

    return (
        <EuiDataGrid
            aria-label="Data Grid"
            columns={initialColumnOrderRef.current}
            height={gridHeight}
            gridStyle={GRID_STYLE}
            columnVisibility={{ visibleColumns, setVisibleColumns }}
            pagination={pagination}
            sorting={columnSortToEuiDataGridSorting(
                dataSorting,
                updateDataSorting,
            )}
            rowCount={pagination.totalRecords}
            renderCellValue={renderCellValue}
        />
    );
};
