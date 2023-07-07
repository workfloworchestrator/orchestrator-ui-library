import { SortDirection } from './columns';

export const determinePageIndex = (pageIndex: number, pageSize: number) =>
    Math.floor(pageIndex / pageSize);

export const determineNewSortOrder = <T>(
    currentSortColumnId: keyof T,
    currentSortDirection: SortDirection,
    newSortColumnId: keyof T,
): SortDirection => {
    if (currentSortColumnId === newSortColumnId) {
        return currentSortDirection === SortDirection.Asc
            ? SortDirection.Desc
            : SortDirection.Asc;
    }

    return SortDirection.Asc;
};
