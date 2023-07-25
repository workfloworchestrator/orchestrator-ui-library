import { EuiDataGridColumn } from '@elastic/eui';
import { ReactNode } from 'react';
import {
    EuiDataGridControlColumn,
    EuiDataGridSorting,
} from '@elastic/eui/src/components/datagrid/data_grid_types';

import { DataSorting, TableColumnKeys } from '../utils/columns';
import { SortOrder } from '../../../types';

export type DataGridTableColumns<T> = {
    [Property in keyof T]: Omit<EuiDataGridColumn, 'id'> & {
        renderCell?: (cellValue: T[Property], row: T) => ReactNode;
        isHiddenByDefault?: boolean;
    };
};

export type ControlColumn<T> = Omit<
    EuiDataGridControlColumn,
    | 'rowCellRender'
    | 'headerCellRender'
    | 'footerCellRender'
    | 'footerCellProps'
    | 'headerCellProps'
> & {
    rowCellRender: (row: T) => ReactNode;
};

export const getInitialColumnOrder = <T>(
    columns: DataGridTableColumns<T>,
    initialColumnOrder: TableColumnKeys<T>,
) => {
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
};

export const mapColumnSortToEuiDataGridSorting = <T>(
    columnSort?: DataSorting<T>,
    updateColumnSort?: (columnSort: DataSorting<T>) => void,
): EuiDataGridSorting => ({
    columns: columnSort
        ? [
              {
                  id: columnSort.field?.toString() ?? '',
                  direction:
                      columnSort.sortOrder === SortOrder.ASC ? 'asc' : 'desc',
              },
          ]
        : [],
    onSort: (columns) => {
        const lastSortData = columns.slice(-1)[0];
        if (updateColumnSort && lastSortData) {
            updateColumnSort({
                field: lastSortData.id as keyof T,
                sortOrder:
                    lastSortData.direction === 'asc'
                        ? SortOrder.ASC
                        : SortOrder.DESC,
            });
        }
    },
});
