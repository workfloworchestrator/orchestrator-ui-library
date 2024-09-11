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

export const getQueryStringHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    (queryString: string) => {
        setDataDisplayParam('queryString', queryString);
    };
