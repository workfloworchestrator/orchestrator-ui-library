import { createSlice } from '@reduxjs/toolkit';
import type { Slice } from '@reduxjs/toolkit';

export type CustomApiConfig = {
    apiName: string;
    apiBaseUrl: string;
};
type CustomApiSlice = Slice<CustomApiConfig[]>;

export const getCustomApiSlice = (
    customApis: CustomApiConfig[],
): CustomApiSlice => {
    return createSlice({
        name: 'customApis',
        initialState: customApis,
        reducers: {},
    });
};
