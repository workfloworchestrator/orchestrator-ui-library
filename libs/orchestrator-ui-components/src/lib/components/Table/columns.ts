import { EuiDataGridColumn } from '@elastic/eui';
import { ReactNode } from 'react';
import {
    EuiDataGridControlColumn,
    EuiDataGridSorting,
} from '@elastic/eui/src/components/datagrid/data_grid_types';

export type TableColumns<T> = {
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

export type DataSorting<T> = {
    columnId: keyof T;
    sortDirection: SortDirection;
};

export enum SortDirection {
    Asc = 'ASC',
    Desc = 'DESC',
}

export function getInitialColumnOrder<T>(
    columns: TableColumns<T>,
    initialColumnOrder: Array<keyof T>,
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

export function columnSortToEuiDataGridSorting<T>(
    columnSort?: DataSorting<T>,
    updateColumnSort?: (columnSort: DataSorting<T>) => void,
): EuiDataGridSorting {
    return {
        columns: columnSort
            ? [
                  {
                      id: columnSort.columnId.toString(),
                      direction:
                          columnSort.sortDirection === SortDirection.Asc
                              ? 'asc'
                              : 'desc',
                  },
              ]
            : [],
        onSort: (columns) => {
            const lastSortData = columns.slice(-1)[0];
            if (updateColumnSort && lastSortData) {
                updateColumnSort({
                    columnId: lastSortData.id as keyof T,
                    sortDirection:
                        lastSortData.direction === 'asc'
                            ? SortDirection.Asc
                            : SortDirection.Desc,
                });
            }
        },
    };
}
