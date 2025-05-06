import type { PydanticComponentMatcher } from 'pydantic-forms';

import { Slice, createSlice } from '@reduxjs/toolkit';

type PydanticComponentMatcherSlice = Slice<
    PydanticComponentMatcher | undefined
>;

export const getPydanticComponentMatcherSlice = (
    pydanticComponentMatcher?: PydanticComponentMatcher,
): PydanticComponentMatcherSlice =>
    createSlice({
        name: 'pydanticComponentMatcher',
        initialState: pydanticComponentMatcher,
        reducers: {},
    });
