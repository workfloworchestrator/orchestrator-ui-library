import { EuiBasicTableColumn } from '@elastic/eui';
import { ReactNode } from 'react';
import { SortOrder } from '../../../types';

// Todo need to Pick a few more props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
// https://github.com/workfloworchestrator/orchestrator-ui/issues/130
export type BasicTableColumn<T> = Omit<EuiBasicTableColumn<T>, 'render'>;

export type TableDataColumnConfig<T, Property> = BasicTableColumn<T> & {
    field: Property;
    name: string;
};

// Todo need to Pick a few props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
export type TableColumnsWithExtraNonDataFields<T> = TableColumns<T> & {
    [key: string]: EuiBasicTableColumn<T> & {
        field: string;
        name?: string;
    };
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

export type DataSorting<T> = {
    field: keyof T;
    sortOrder: SortOrder;
};

export const getSortDirectionFromString = (
    sortOrder?: string,
): SortOrder | undefined => {
    if (!sortOrder) {
        return undefined;
    }

    switch (sortOrder.toUpperCase()) {
        case SortOrder.ASC.toString():
            return SortOrder.ASC;
        case SortOrder.DESC.toString():
            return SortOrder.DESC;
        default:
            return undefined;
    }
};
