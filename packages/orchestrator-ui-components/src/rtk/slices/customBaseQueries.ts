import { createSlice } from '@reduxjs/toolkit';
import type { Slice } from '@reduxjs/toolkit';
import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';

export type CustomBaseQueryFn = BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    NonNullable<unknown>,
    FetchBaseQueryMeta
>;
export type CustomBaseQuery = {
    queryType: string;
    customFn: CustomBaseQueryFn;
};
type CustomBaseQueriesSlice = Slice<CustomBaseQuery[]>;

export const getCustomBaseQueriesSlice = (
    config: CustomBaseQuery[],
): CustomBaseQueriesSlice => {
    return createSlice({
        name: 'customBaseQueries',
        initialState: config,
        reducers: {},
    });
};
