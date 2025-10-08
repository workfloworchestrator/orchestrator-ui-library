import { SortOrder } from '@/types';

export const WFO_STATUS_COLOR_FIELD = 'statusColorField';

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
