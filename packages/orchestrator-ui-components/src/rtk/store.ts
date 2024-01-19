import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';

import { orchestratorApi } from './api';
import { toastMessagesReducer } from './slices/toastMessages';

export type RootState = {
    [orchestratorApi.reducerPath]: ReturnType<typeof orchestratorApi.reducer>;
    toastMessages: ReturnType<typeof toastMessagesReducer>;
};

export const orchestratorStore: EnhancedStore<RootState> = configureStore({
    reducer: {
        [orchestratorApi.reducerPath]: orchestratorApi.reducer,
        toastMessages: toastMessagesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(orchestratorApi.middleware),
});

export type AppDispatch = typeof orchestratorStore.dispatch;
