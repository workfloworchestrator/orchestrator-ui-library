import type { ComponentMatcherExtender } from 'pydantic-forms';

import { Slice, createSlice } from '@reduxjs/toolkit';

export type PydanticForm = {
    componentMatcherExtender?: ComponentMatcherExtender;
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
