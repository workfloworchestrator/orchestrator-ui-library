import { EuiBasicTableColumn } from '@elastic/eui';
import { ReactNode } from 'react';
import { SortOrder } from '../../../types';

// Todo need to Pick a few more props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
// https://github.com/workfloworchestrator/orchestrator-ui/issues/130
export type WFOBasicTableColumn<T> = Omit<EuiBasicTableColumn<T>, 'render'>;

export type WFOTableDataColumnConfig<T, Property> = WFOBasicTableColumn<T> & {
    field: Property;
    name: string;
};

// Todo need to Pick a few props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
export type WFOTableColumnsWithExtraNonDataFields<T> = WFOTableColumns<T> & {
    [key: string]: EuiBasicTableColumn<T> & {
        field: string;
        name?: string;
    };
};

export type WFOTableColumns<T> = {
    [Property in keyof T]: WFOTableDataColumnConfig<T, Property> & {
        render?: (cellValue: T[Property], row: T) => ReactNode;
    };
};

export type WFOTableControlColumnConfig<T> = {
    [key: string]: WFOBasicTableColumn<T> & {
        field: string;
        name?: string;
        render: (cellValue: never, row: T) => ReactNode;
    };
};

export type WFOTableColumnsWithControlColumns<T> = WFOTableColumns<T> &
    WFOTableControlColumnConfig<T>;

export type TableColumnKeys<T> = Array<keyof T>;

export type WFODataSorting<T> = {
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
