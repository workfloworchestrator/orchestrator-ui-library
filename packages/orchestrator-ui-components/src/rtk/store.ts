import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { CombinedState } from '@reduxjs/toolkit/query';

import type { OrchestratorConfig } from '@/types';

import { orchestratorApi } from './api';
import { getOrchestratorConfigSlice, toastMessagesReducer } from './slices';
import {
    CustomBaseQuery,
    getCustomBaseQueriesSlice,
} from './slices/customBaseQueries';

export type RootState = {
    orchestratorApi: CombinedState<
        Record<string, never>,
        'engineStatus',
        'orchestratorApi'
    >;
    toastMessages: ReturnType<typeof toastMessagesReducer>;
    orchestratorConfig: OrchestratorConfig;
    customBaseQueries?: CustomBaseQuery[];
};

export const getOrchestratorStore = (
    orchestratorConfig: OrchestratorConfig,
    customBaseQueries?: CustomBaseQuery[],
): EnhancedStore<RootState> => {
    const configSlice = getOrchestratorConfigSlice(orchestratorConfig);
    const customBaseQueriesSlice = customBaseQueries
        ? getCustomBaseQueriesSlice(customBaseQueries)
        : null;

    const orchestratorStore = configureStore({
        reducer: {
            [orchestratorApi.reducerPath]: orchestratorApi.reducer,
            toastMessages: toastMessagesReducer,
            orchestratorConfig: configSlice.reducer,
            ...(customBaseQueriesSlice
                ? { customBaseQueries: customBaseQueriesSlice.reducer }
                : {}),
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(orchestratorApi.middleware),
    });

    return orchestratorStore;
};

export type AppDispatch = Dispatch<UnknownAction>;
