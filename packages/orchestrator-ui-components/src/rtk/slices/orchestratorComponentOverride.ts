import { Slice, createSlice } from '@reduxjs/toolkit';

import { ValueOverrideConfiguration } from '@/contexts';

export type OrchestratorComponentOverride = {
    subscriptionDetail?: {
        valueOverrides?: ValueOverrideConfiguration;
    };
};

type OrchestratorComponentOverrideSlice = Slice<OrchestratorComponentOverride>;

export const getOrchestratorComponentOverrideSlice = (
    config: OrchestratorComponentOverride,
): OrchestratorComponentOverrideSlice => {
    return createSlice({
        name: 'orchestratorComponentOverride',
        initialState: config,
        reducers: {},
    });
};
