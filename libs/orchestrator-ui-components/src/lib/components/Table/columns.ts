import { EuiDataGridColumn } from '@elastic/eui';
import { ReactNode } from 'react';
import {
    EuiDataGridControlColumn,
    EuiDataGridSorting,
} from '@elastic/eui/src/components/datagrid/data_grid_types';

export enum SortDirection {
    Asc = 'ASC',
    Desc = 'DESC',
}

export type DataSorting<T> = {
    columnId: keyof T;
    sortDirection: SortDirection;
};

export const getSortDirectionFromString = (
    sortOrder?: string,
): SortDirection | undefined => {
    if (!sortOrder) {
        return undefined;
    }

    switch (sortOrder.toUpperCase()) {
        case SortDirection.Asc.toString():
            return SortDirection.Asc;
        case SortDirection.Desc.toString():
            return SortDirection.Desc;
        default:
            return undefined;
    }
};

// Todo: code below is part of the DataGridTable, code above is used in Table

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

export function getInitialColumnOrder<T>(
    columns: DataGridTableColumns<T>,
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
