import { EuiBasicTableColumn } from '@elastic/eui';
import { ReactNode } from 'react';

// Todo need to Pick a few more props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
// https://github.com/workfloworchestrator/orchestrator-ui/issues/130
export type BasicTableColumn<T> = Omit<EuiBasicTableColumn<T>, 'render'>;

export type TableDataColumnConfig<T, Property> = BasicTableColumn<T> & {
    field: Property;
    name: string;
};

export type TableColumns<T> = {
    [Property in keyof T]: TableDataColumnConfig<T, Property> & {
        render?: (cellValue: T[Property], row: T) => ReactNode;
    };
};

export type TableControlColumnConfig<T> = {
    [key: string]: BasicTableColumn<T> & {
        field: string;
        name?: string;
        render: (row: T) => ReactNode;
    };
};

export type TableColumnsWithControlColumns<T> = TableColumns<T> &
    TableControlColumnConfig<T>;

export type TableColumnKeys<T> = Array<keyof T>;

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
