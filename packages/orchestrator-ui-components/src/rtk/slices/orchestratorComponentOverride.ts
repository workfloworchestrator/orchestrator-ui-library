import { Slice, createSlice } from '@reduxjs/toolkit';

import { ValueOverrideFunction } from '@/components/WfoSubscription/overrides/useSubscriptionDetailValueOverride';

export type ValueOverrideConfiguration = Record<string, ValueOverrideFunction>;

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
