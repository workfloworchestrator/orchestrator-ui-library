import React from 'react';
import {
    EuiDataGrid,
    EuiDataGridCellValueElementProps,
    EuiDataGridStyle,
} from '@elastic/eui';
import { useRef, useState } from 'react';
import {
    mapColumnSortToEuiDataGridSorting,
    WfoControlColumn,
    getInitialColumnOrder,
    WfoDataGridTableColumns,
} from './WfodataGridColumns';
import {
    EuiDataGridControlColumn,
    EuiDataGridPaginationProps,
} from '@elastic/eui/src/components/datagrid/data_grid_types';
import { WfoDataSorting, TableColumnKeys } from '../utils/columns';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

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

export type WfoDataGridTableProps<T> = {
    data: T[];
    pagination: Pagination;
    columns: WfoDataGridTableColumns<T>;
    leadingControlColumns?: WfoControlColumn<T>[];
    trailingControlColumns?: WfoControlColumn<T>[];
    initialColumnOrder: TableColumnKeys<T>;
    dataSorting?: WfoDataSorting<T>;
    handleRowClick?: (row: T) => void;
    updateDataSorting?: (updatedDataSorting: WfoDataSorting<T>) => void;
};

export const WfoDataGridTable = <T,>({
    data,
    pagination,
    columns,
    leadingControlColumns,
    trailingControlColumns,
    initialColumnOrder,
    dataSorting,
    handleRowClick,
    updateDataSorting,
}: WfoDataGridTableProps<T>) => {
    const initialColumnOrderRef = useRef(
        getInitialColumnOrder(columns, initialColumnOrder),
    );

    const defaultVisibleColumns: string[] = initialColumnOrder
        .filter((columnId) => !columns[columnId].isHiddenByDefault)
        .map((columnId) => columnId.toString());
    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
    const pageSize = pagination.pageSize ?? DEFAULT_PAGE_SIZE;
    const { pageIndex } = pagination;

    const renderCellValue = ({
        rowIndex,
        columnId,
        setCellProps,
    }: EuiDataGridCellValueElementProps) => {
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
        controlColumn: WfoControlColumn<T>,
    ) => EuiDataGridControlColumn = ({ id, width, rowCellRender }) => ({
        id,
        width,
        headerCellRender: () => null,
        rowCellRender: ({ rowIndex }: { rowIndex: number }) => {
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
        pageSize * EUI_DATA_GRID_ROW_HEIGHT + EUI_DATA_GRID_HEIGHT_OFFSET;

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
