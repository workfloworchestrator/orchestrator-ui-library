import type { PydanticComponentMatcher } from 'pydantic-forms';

import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { CombinedState } from '@reduxjs/toolkit/query';

import { CustomApiConfig, getCustomApiSlice } from '@/rtk/slices';
import {
    OrchestratorComponentOverride,
    getOrchestratorComponentOverrideSlice,
} from '@/rtk/slices/orchestratorComponentOverride';
import { getPydanticComponentMatcherSlice } from '@/rtk/slices/pydanticComponentMatcher';
import type { OrchestratorConfig } from '@/types';

import { orchestratorApi } from './api';
import { getOrchestratorConfigSlice, toastMessagesReducer } from './slices';

export type RootState = {
    orchestratorApi: CombinedState<
        Record<string, never>,
        'engineStatus',
        'orchestratorApi'
    >;
    toastMessages: ReturnType<typeof toastMessagesReducer>;
    orchestratorConfig: OrchestratorConfig;
    orchestratorComponentOverride?: OrchestratorComponentOverride;
    pydanticComponentMatcher?: PydanticComponentMatcher;
    customApis: CustomApiConfig[];
};

export type InitialOrchestratorStoreConfig = Pick<
    RootState,
    | 'orchestratorConfig'
    | 'customApis'
    | 'orchestratorComponentOverride'
    | 'pydanticComponentMatcher'
>;

export const getOrchestratorStore = ({
    orchestratorConfig,
    orchestratorComponentOverride = {},
    pydanticComponentMatcher,
    customApis,
}: InitialOrchestratorStoreConfig): EnhancedStore<RootState> => {
    const configSlice = getOrchestratorConfigSlice(orchestratorConfig);
    const orchestratorComponentOverrideSlice =
        getOrchestratorComponentOverrideSlice(orchestratorComponentOverride);
    const customApisSlice = getCustomApiSlice(customApis);
    const pydanticComponentMatcherSlice = getPydanticComponentMatcherSlice(
        pydanticComponentMatcher,
    );

    const orchestratorStore = configureStore({
        reducer: {
            [orchestratorApi.reducerPath]: orchestratorApi.reducer,
            toastMessages: toastMessagesReducer,
            orchestratorConfig: configSlice.reducer,
            orchestratorComponentOverride:
                orchestratorComponentOverrideSlice.reducer,
            customApis: customApisSlice?.reducer,
            pydanticComponentMatcher: pydanticComponentMatcherSlice?.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }).concat(orchestratorApi.middleware),
    });

    return orchestratorStore;
};

export type AppDispatch = Dispatch<UnknownAction>;
