import {
    NumberParam,
    ObjectParam,
    StringParam,
    useQueryParams,
    withDefault,
} from 'use-query-params';

import { GraphQLSort } from '../types';
import { DEFAULT_PAGE_SIZE } from '../components';

export type DataDisplayParams<Type> = {
    pageSize: number;
    pageIndex: number;
    sortBy?: GraphQLSort<Type>;
    esQueryString?: string; // The filter param is going to send to the backend as is for parsing
};

export interface DataDisplayReturnValues<Type> {
    dataDisplayParams: DataDisplayParams<Type>;
    setDataDisplayParam: <PropKey extends keyof DataDisplayParams<Type>>(
        prop: PropKey,
        value: DataDisplayParams<Type>[PropKey],
    ) => void;
}

export const useDataDisplayParams = <Type>(
    initialParams: Partial<DataDisplayParams<Type>>,
): DataDisplayReturnValues<Type> => {
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
        esQueryString: withDefault(
            StringParam,
            defaultParams.esQueryString ? defaultParams.esQueryString : '',
        ),
    });

    const setDataDisplayParam = <PropKey extends keyof DataDisplayParams<Type>>(
        prop: PropKey,
        value: DataDisplayParams<Type>[PropKey],
    ) => {
        setDataDisplayParams((lastParams) => ({
            ...lastParams,
            [prop]: value,
        }));
    };

    return {
        dataDisplayParams: dataDisplayParams as DataDisplayParams<Type>,
        setDataDisplayParam,
    };
};
