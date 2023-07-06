import {
    NumberParam,
    ObjectParam,
    useQueryParams,
    withDefault,
} from 'use-query-params';

import { GraphQLSort, GraphqlFilter } from '../types';

export type DataDisplayParams<Type> = {
    pageSize: number;
    pageIndex: number;
    sortBy?: GraphQLSort<Type>;
    filterBy?: GraphqlFilter<Type>[];
};

export const useDataDisplayParams = <Type>(
    initialParams: DataDisplayParams<Type>,
) => {
    const [dataDisplayParams, setDataDisplayParams] = useQueryParams({
        pageSize: withDefault(NumberParam, initialParams.pageSize),
        pageIndex: withDefault(NumberParam, initialParams.pageIndex),
        sorting: ObjectParam,
        filter: ObjectParam,
    });

    // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
    const setDataDisplayParam = <
        DisplayParamKey extends keyof DataDisplayParams<Type>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<Type>[DisplayParamKey],
    ) => {
        setDataDisplayParams({
            ...dataDisplayParams,
            [prop]: value,
        });
    };

    return {
        dataDisplayParams: dataDisplayParams as DataDisplayParams<Type>,
        setDataDisplayParam,
    };
};
