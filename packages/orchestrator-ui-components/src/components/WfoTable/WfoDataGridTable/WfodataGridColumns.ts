import { ReactNode } from 'react';

import { EuiDataGridColumn } from '@elastic/eui';
import {
    EuiDataGridControlColumn,
    EuiDataGridSorting,
} from '@elastic/eui/src/components/datagrid/data_grid_types';

import { SortOrder } from '../../../types';
import { TableColumnKeys, WfoDataSorting } from '../utils/columns';

export type WfoDataGridTableColumns<T> = {
    [Property in keyof T]: Omit<EuiDataGridColumn, 'id'> & {
        renderCell?: (cellValue: T[Property], row: T) => ReactNode;
        isHiddenByDefault?: boolean;
    };
};

export type WfoControlColumn<T> = Omit<
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
    columns: WfoDataGridTableColumns<T>,
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
    columnSort?: WfoDataSorting<T>,
    updateColumnSort?: (columnSort: WfoDataSorting<T>) => void,
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
