import type { Store } from 'redux';

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { orchestratorApi } from './api';

export const store: Store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [orchestratorApi.reducerPath]: orchestratorApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(orchestratorApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
