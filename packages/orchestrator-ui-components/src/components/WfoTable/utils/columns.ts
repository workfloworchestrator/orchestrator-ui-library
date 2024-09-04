import { ReactNode } from 'react';

import { EuiBasicTableColumn } from '@elastic/eui';

import { SortOrder } from '../../../types';

// Todo need to Pick a few more props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
// https://github.com/workfloworchestrator/orchestrator-ui/issues/130
export type WfoEuiBasicTableColumn<T extends object> = Omit<
    EuiBasicTableColumn<T>,
    'render'
>;

export type WfoTableDataColumnConfig<
    T extends object,
    Property,
> = WfoEuiBasicTableColumn<T> & {
    field: Property;
    name: string;
    sortable?: boolean;
    filterable?: boolean;
    truncateText?: boolean;
    showTooltip?: boolean;
};

export const WFO_STATUS_COLOR_FIELD = 'statusColorField';

// Todo need to Pick a few props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
export type WfoTableColumnsWithExtraNonDataFields<T extends object> =
    WfoTableColumns<T> & {
        [key: string]: EuiBasicTableColumn<T> & {
            field: string;
            name?: string;
        };
    };

export type WfoTableColumns<T extends object> = {
    [Property in keyof T]: WfoTableDataColumnConfig<T, Property> & {
        render?: (cellValue: T[Property], row: T) => ReactNode;
        renderDetails?: (cellValue: T[Property], row: T) => ReactNode;
        clipboardText?: (cellValue: T[Property], row: T) => string;
        showTooltip?: boolean;
    };
};

export type WfoTableControlColumnConfig<T extends object> = {
    [key: string]: WfoEuiBasicTableColumn<T> & {
        field: string;
        name?: string;
        render: (cellValue: never, row: T) => ReactNode;
    };
};

export type TableColumnKeys<T> = Array<keyof T>;

export type WfoDataSorting<T> = {
    field: keyof T;
    sortOrder: SortOrder;
};

export type WfoDataSearch<T> = {
    field: keyof T;
    searchText: string;
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
