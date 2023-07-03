import { EuiBasicTableColumn } from '@elastic/eui';

export type TableColumnConfig<T, Property> = EuiBasicTableColumn<T> & {
    field: Property;
    name: string;
};

export type TableColumns<T> = {
    [Property in keyof T]: TableColumnConfig<T, Property>;
};

// Todo need to Pick a few props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
export type TableColumnsWithExtraNonDataFields<T> = TableColumns<T> & {
    [key: string]: EuiBasicTableColumn<T> & {
        field: string;
        name?: string;
    };
};

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
