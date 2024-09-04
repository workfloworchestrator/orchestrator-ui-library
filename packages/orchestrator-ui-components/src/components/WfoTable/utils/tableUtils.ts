import type { Criteria } from '@elastic/eui';

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

// Todo: to be used with WfoBasicTable
// Todo: The type Criteria is EuiTable specific -- remove it
export const getPageChangeHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    (page: Criteria<Type>['page']) => {
        if (page) {
            const { index, size } = page;
            setDataDisplayParam('pageSize', size);
            setDataDisplayParam('pageIndex', index);
        }
    };

// Todo: to be used with WfoTable
export const getPageSizeChangeHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    (pageSize: number) => {
        setDataDisplayParam('pageSize', pageSize);
    };

// Todo: to be used with WfoTable
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
