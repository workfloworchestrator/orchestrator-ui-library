import { ReactNode } from 'react';

import { Slice, createSlice } from '@reduxjs/toolkit';

import { FieldValue, SubscriptionDetail } from '@/types';

export type ValueOverrideFunction = (fieldValue: FieldValue) => ReactNode;
export type ValueOverrideConfiguration = Record<string, ValueOverrideFunction>;

export type WfoSubscriptionDetailGeneralConfiguration = {
    id: string;
    node: ReactNode;
};

export type OrchestratorComponentOverride = {
    subscriptionDetail?: {
        valueOverrides?: ValueOverrideConfiguration;
        generalSectionConfigurationOverride?: (
            defaultSections: WfoSubscriptionDetailGeneralConfiguration[],
            subscriptionDetail: SubscriptionDetail,
        ) => WfoSubscriptionDetailGeneralConfiguration[];
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
