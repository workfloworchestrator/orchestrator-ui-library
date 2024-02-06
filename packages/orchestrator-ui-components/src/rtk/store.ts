import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { CombinedState } from '@reduxjs/toolkit/query';

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
};

export const getOrchestratorStore = (
    orchestratorConfig: OrchestratorConfig,
): EnhancedStore<RootState> => {
    const configSlice = getOrchestratorConfigSlice(orchestratorConfig);

    const orchestratorStore = configureStore({
        reducer: {
            [orchestratorApi.reducerPath]: orchestratorApi.reducer,
            toastMessages: toastMessagesReducer,
            orchestratorConfig: configSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(orchestratorApi.middleware),
    });

    return orchestratorStore;
};

export type AppDispatch = Dispatch<UnknownAction>;
