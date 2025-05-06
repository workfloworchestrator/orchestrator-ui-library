import type { ComponentMatcher } from 'pydantic-forms';

import { Slice, createSlice } from '@reduxjs/toolkit';

export type PydanticForm = {
    componentMatcher?: ComponentMatcher;
};

type PydanticFormComponentMatcherSlice = Slice<PydanticForm>;

export const getPydanticFormSlice = (
    pydanticForm: PydanticForm,
): PydanticFormComponentMatcherSlice =>
    createSlice({
        name: 'pydanticForm',
        initialState: pydanticForm,
        reducers: {},
    });
