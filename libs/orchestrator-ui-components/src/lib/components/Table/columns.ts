import { EuiBasicTableColumn } from '@elastic/eui';
import { SortOrder } from '../../types';
export type TableColumns<T> = {
    [Property in keyof T]: EuiBasicTableColumn<T> & {
        field: Property;
        name: string;
    };
};

// Todo need to Pick a few props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
export type TableColumnsWithExtraNonDataFields<T> = TableColumns<T> & {
    [key: string]: EuiBasicTableColumn<T> & {
        field: string;
        name?: string;
    };
};

export type DataSorting<T> = {
    columnId?: keyof T;
    sortDirection?: SortOrder;
};

export const getSortDirectionFromString = (
    sortOrder?: string,
): SortOrder | undefined => {
    if (!sortOrder) {
        return undefined;
    }

    switch (sortOrder.toUpperCase()) {
        case SortOrder.Asc.toString():
            return SortOrder.Asc;
        case SortOrder.Desc.toString():
            return SortOrder.Desc;
        default:
            return undefined;
    }
};
