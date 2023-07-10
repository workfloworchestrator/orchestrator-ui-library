import type { Criteria } from '@elastic/eui';

import { SortOrder } from '../../types';

import type { DataDisplayParams } from '../../hooks';

import type { DataDisplayReturnValues } from '../../hooks';

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

export const getDataSortHandler = <Type>(
    dataDisplayParams: DataDisplayParams<Type>,
    setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
) => {
    return (newSortField: keyof Type) => {
        const newOrder = (() => {
            if (
                dataDisplayParams.sortBy &&
                dataDisplayParams.sortBy.order &&
                dataDisplayParams.sortBy.field
            ) {
                return determineNewSortOrder<Type>(
                    dataDisplayParams.sortBy?.field,
                    dataDisplayParams.sortBy?.order,
                    newSortField,
                );
            } else {
                return SortOrder.ASC;
            }
        })();

        setDataDisplayParam('sortBy', {
            field: newSortField,
            order: newOrder,
        });
    };
};

export const getPageSizeHandler = <Type>(
    setDataDisplayParam: DataDisplayReturnValues<Type>['setDataDisplayParam'],
) => {
    return ({ page }: Criteria<Type>) => {
        if (page) {
            const { index, size } = page;
            setDataDisplayParam('pageSize', size);
            setDataDisplayParam('pageIndex', index);
        }
    };
};
