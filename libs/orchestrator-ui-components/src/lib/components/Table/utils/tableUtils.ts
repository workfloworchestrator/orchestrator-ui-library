import { SortOrder } from '../../types';

export const determinePageIndex = (pageIndex: number, pageSize: number) =>
    Math.floor(pageIndex / pageSize);

export const determineNewSortOrder = <T>(
    currentSortColumnId: keyof T,
    currentSortOrder: SortOrder,
    newSortColumnId: keyof T,
): SortOrder => {
    if (currentSortColumnId === newSortColumnId) {
        return currentSortOrder === SortOrder.Asc
            ? SortOrder.Desc
            : SortOrder.Asc;
    }

    return SortOrder.Asc;
};
