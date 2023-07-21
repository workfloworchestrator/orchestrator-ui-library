import {
    EuiDataGrid,
    EuiDataGridCellValueElementProps,
    EuiDataGridStyle,
} from '@elastic/eui';
import { useRef, useState } from 'react';
import {
    mapColumnSortToEuiDataGridSorting,
    ControlColumn,
    getInitialColumnOrder,
    DataGridTableColumns,
} from './dataGridColumns';
import {
    EuiDataGridControlColumn,
    EuiDataGridPaginationProps,
} from '@elastic/eui/src/components/datagrid/data_grid_types';
import { DataSorting, TableColumnKeys } from '../utils/columns';

// Total height of grid button bar, table header and pagination bar
const EUI_DATA_GRID_HEIGHT_OFFSET = 103;
const EUI_DATA_GRID_ROW_HEIGHT = 40;

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

export type DataGridTableProps<T> = {
    data: T[];
    pagination: Pagination;
    columns: DataGridTableColumns<T>;
    leadingControlColumns?: ControlColumn<T>[];
    trailingControlColumns?: ControlColumn<T>[];
    initialColumnOrder: TableColumnKeys<T>;
    dataSorting?: DataSorting<T>;
    handleRowClick?: (row: T) => void;
    updateDataSorting?: (updatedDataSorting: DataSorting<T>) => void;
};

export const DataGridTable = <T,>({
    data,
    pagination,
    columns,
    leadingControlColumns,
    trailingControlColumns,
    initialColumnOrder,
    dataSorting,
    handleRowClick,
    updateDataSorting,
}: DataGridTableProps<T>) => {
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

        if (handleRowClick) {
            setCellProps({
                css: { cursor: 'pointer' },
                onClick: () => handleRowClick(dataRow),
            });
        }

        return column.renderCell
            ? column.renderCell(cellValue, dataRow)
            : `${cellValue}`;
    };

    const mapControlColumnToEuiDataGridControlColumn: (
        controlColumn: ControlColumn<T>,
    ) => EuiDataGridControlColumn = ({ id, width, rowCellRender }) => ({
        id,
        width,
        headerCellRender: (props) => null,
        rowCellRender: ({ rowIndex }: { rowIndex: number }) => {
            const { pageSize, pageIndex } = pagination;
            const rowIndexOnPage = rowIndex - pageIndex * pageSize;

            const dataRow = data[rowIndexOnPage];

            return rowCellRender(dataRow);
        },
    });

    const euiDataGridLeadingControlColumns = leadingControlColumns?.map(
        mapControlColumnToEuiDataGridControlColumn,
    );

    const euiDataGridTrailingControlColumns = trailingControlColumns?.map(
        mapControlColumnToEuiDataGridControlColumn,
    );

    const gridHeightValue =
        pagination.pageSize * EUI_DATA_GRID_ROW_HEIGHT +
        EUI_DATA_GRID_HEIGHT_OFFSET;

    return (
        <EuiDataGrid
            aria-label="Data Grid"
            columns={initialColumnOrderRef.current}
            leadingControlColumns={euiDataGridLeadingControlColumns}
            trailingControlColumns={euiDataGridTrailingControlColumns}
            height={`${gridHeightValue}px`}
            gridStyle={GRID_STYLE}
            columnVisibility={{ visibleColumns, setVisibleColumns }}
            pagination={pagination}
            sorting={mapColumnSortToEuiDataGridSorting(
                dataSorting,
                updateDataSorting,
            )}
            rowCount={pagination.totalRecords}
            renderCellValue={renderCellValue}
        />
    );
};
