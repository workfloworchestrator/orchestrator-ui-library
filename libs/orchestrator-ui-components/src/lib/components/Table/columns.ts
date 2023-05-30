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
