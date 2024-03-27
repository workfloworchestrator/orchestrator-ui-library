import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { CombinedState } from '@reduxjs/toolkit/query';

import { CustomApiConfig, getCustomApiSlice } from '@/rtk/slices';
import {
    OrchestratorComponentOverride,
    getOrchestratorComponentOverrideSlice,
} from '@/rtk/slices/orchestratorComponentOverride';
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
    customApis: CustomApiConfig[];
};

export type InitialOrchestratorStoreConfig = Pick<
    RootState,
    'orchestratorConfig' | 'customApis' | 'orchestratorComponentOverride'
>;

export const getOrchestratorStore = ({
    orchestratorConfig,
    orchestratorComponentOverride = {},
    customApis,
}: InitialOrchestratorStoreConfig): EnhancedStore<RootState> => {
    const configSlice = getOrchestratorConfigSlice(orchestratorConfig);
    const orchestratorComponentOverrideSlice =
        getOrchestratorComponentOverrideSlice(orchestratorComponentOverride);
    const customApisSlice = getCustomApiSlice(customApis);

    const orchestratorStore = configureStore({
        reducer: {
            [orchestratorApi.reducerPath]: orchestratorApi.reducer,
            toastMessages: toastMessagesReducer,
            orchestratorConfig: configSlice.reducer,
            orchestratorComponentOverride:
                orchestratorComponentOverrideSlice.reducer,
            customApis: customApisSlice?.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(orchestratorApi.middleware),
    });

    return orchestratorStore;
};

export type AppDispatch = Dispatch<UnknownAction>;
