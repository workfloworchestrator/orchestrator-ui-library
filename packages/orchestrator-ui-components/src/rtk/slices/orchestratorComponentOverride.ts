import { ReactElement, ReactNode } from 'react';

import { Slice, createSlice } from '@reduxjs/toolkit';

import { FieldValue, RenderableFieldValue, SubscriptionDetail } from '@/types';

export type ValueOverrideFunction = (
    fieldValue: FieldValue | RenderableFieldValue,
    allFieldValues: FieldValue[],
) => ReactNode;
export type ValueOverrideConfiguration = Record<string, ValueOverrideFunction>;

export type WfoSubscriptionDetailGeneralConfiguration = {
    id: string;
    node: ReactNode;
};

export type OrchestratorComponentOverride = {
    startPage?: {
        summaryCardConfigurationOverride?: (
            defaultItems: ReactElement[],
        ) => ReactElement[];
    };
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
): OrchestratorComponentOverrideSlice =>
    createSlice({
        name: 'orchestratorComponentOverride',
        initialState: config,
        reducers: {},
    });
