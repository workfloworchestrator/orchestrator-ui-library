import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';

import { orchestratorApi } from './api';

export interface RootState {}

export const orchestratorStore: EnhancedStore<RootState> = configureStore({
    reducer: {
        [orchestratorApi.reducerPath]: orchestratorApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(orchestratorApi.middleware),
});

export type AppDispatch = typeof orchestratorStore.dispatch;
