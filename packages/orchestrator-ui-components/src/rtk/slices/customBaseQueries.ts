import { createSlice } from '@reduxjs/toolkit';
import type { Slice } from '@reduxjs/toolkit';
import { BaseQueryFn } from '@reduxjs/toolkit/query';

export type CustomBaseQuery = {
    queryType: string;
    customFn: BaseQueryFn<any, any, any, string>;
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
