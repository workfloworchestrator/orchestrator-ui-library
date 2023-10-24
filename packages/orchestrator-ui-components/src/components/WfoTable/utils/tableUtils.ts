import type { Criteria } from '@elastic/eui';
import { SortOrder } from '../../../types';

import type { DataDisplayReturnValues } from '../../../hooks';
import { WFODataSorting } from './columns';

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
    ({ field, sortOrder }: WFODataSorting<Type>) => {
        setDataDisplayParam('sortBy', {
            field: field,
            order: sortOrder,
        });
    };

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

export const getEsQueryStringHandler =
    <Type>(
        setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
    ) =>
    (esQueryString: string) => {
        setDataDisplayParam('esQueryString', esQueryString);
    };
