import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { CombinedState } from '@reduxjs/toolkit/query';

import { CustomApiConfig, getCustomApiSlice } from '@/rtk/slices';
import {
    OrchestratorComponentOverride,
    getOrchestratorComponentOverrideSlice,
} from '@/rtk/slices/orchestratorComponentOverride';
import { PydanticForm, getPydanticFormSlice } from '@/rtk/slices/pydanticForm';
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
    pydanticForm?: PydanticForm;
    customApis: CustomApiConfig[];
};

export type InitialOrchestratorStoreConfig = Pick<
    RootState,
    | 'orchestratorConfig'
    | 'customApis'
    | 'orchestratorComponentOverride'
    | 'pydanticForm'
>;

export const getOrchestratorStore = ({
    orchestratorConfig,
    orchestratorComponentOverride = {},
    pydanticForm = {},
    customApis,
}: InitialOrchestratorStoreConfig): EnhancedStore<RootState> => {
    const configSlice = getOrchestratorConfigSlice(orchestratorConfig);
    const orchestratorComponentOverrideSlice =
        getOrchestratorComponentOverrideSlice(orchestratorComponentOverride);
    const customApisSlice = getCustomApiSlice(customApis);
    const componentMatcherSlice = getPydanticFormSlice(pydanticForm);

    const orchestratorStore = configureStore({
        reducer: {
            [orchestratorApi.reducerPath]: orchestratorApi.reducer,
            toastMessages: toastMessagesReducer,
            orchestratorConfig: configSlice.reducer,
            orchestratorComponentOverride:
                orchestratorComponentOverrideSlice.reducer,
            customApis: customApisSlice?.reducer,
            componentMatcher: componentMatcherSlice?.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }).concat(orchestratorApi.middleware),
    });

    return orchestratorStore;
};

export type AppDispatch = Dispatch<UnknownAction>;
