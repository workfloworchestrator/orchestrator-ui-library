import {
    NumberParam,
    ObjectParam,
    useQueryParams,
    withDefault,
} from 'use-query-params';

import { GraphQLSort, GraphqlFilter } from '../types';
import { DEFAULT_PAGE_SIZE } from '../components';

export type DataDisplayParams<Type> = {
    pageSize: number;
    pageIndex: number;
    sortBy?: GraphQLSort<Type>;
    filterBy?: GraphqlFilter<Type>[];
};

export const useDataDisplayParams = <Type>(
    initialParams: Partial<DataDisplayParams<Type>>,
) => {
    const defaultParams = {
        pageSize: DEFAULT_PAGE_SIZE,
        pageIndex: 0,
        ...initialParams,
    };

    const [dataDisplayParams, setDataDisplayParams] = useQueryParams({
        pageSize: withDefault(NumberParam, defaultParams.pageSize),
        pageIndex: withDefault(NumberParam, defaultParams.pageIndex),
        sortBy: withDefault(
            ObjectParam,
            defaultParams.sortBy ? defaultParams.sortBy : {},
        ),
        filterBy: withDefault(
            ObjectParam,
            defaultParams.filterBy ? defaultParams.filterBy : {},
        ),
    });

    // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
    const setDataDisplayParam = <
        DisplayParamKey extends keyof DataDisplayParams<Type>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<Type>[DisplayParamKey],
    ) => {
        setDataDisplayParams((lastParams) => {
            return {
                ...lastParams,
                [prop]: value,
            };
        });
    };

    return {
        dataDisplayParams: dataDisplayParams as DataDisplayParams<Type>,
        setDataDisplayParam,
    };
};
