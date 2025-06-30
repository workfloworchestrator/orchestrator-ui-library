import { Pagination } from '@/components';
import type { DataDisplayReturnValues } from '@/hooks';
import { SortOrder } from '@/types';

import { WfoDataSorting } from './columns';

export const determinePageIndex = (pageIndex: number, pageSize: number) =>
    Math.floor(pageIndex / pageSize);

export const determineNewSortOrder = <T>(
    currentSortField: keyof T,
    currentSortOrder: SortOrder,
    newSortField: keyof T,
): SortOrder => {
    if (currentSortField === newSortField) {
        return currentSortOrder === SortOrder.ASC
            ? SortOrder.DESC
            : SortOrder.ASC;
    }

    return SortOrder.ASC;
};

export const getDataSortHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    ({ field, sortOrder }: WfoDataSorting<Type>) => {
        setDataDisplayParam('sortBy', {
            field: field,
            order: sortOrder,
        });
    };

export const getPageSizeChangeHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    (pageSize: number) => {
        setDataDisplayParam('pageSize', pageSize);
    };

export const getPageIndexChangeHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    (pageIndex: number) => {
        setDataDisplayParam('pageIndex', pageIndex);
    };

export const hasSpecialCharacterOrSpace = (string: string): boolean => {
    return /[^a-zA-Z0-9] */.test(string);
};

export const getQueryStringHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    (queryString: string) => {
        // https://github.com/workfloworchestrator/orchestrator-ui-library/issues/1732
        // Refer to the issue for some details on this
        const query =
            queryString && !hasSpecialCharacterOrSpace(queryString)
                ? `${queryString}*`
                : queryString;
        setDataDisplayParam('queryString', query);
        setDataDisplayParam('pageIndex', 0);
    };

export const getPageCount = (pagination: Pagination) =>
    // In case the pageIndex is out of range calculated by totalItemCount and pageSize, the pageIndex should be returned to be transparent to the user
    Math.max(
        Math.ceil(pagination.totalItemCount / pagination.pageSize),
        pagination.pageIndex + 1,
    );
