import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { orchestratorApi } from './api';
import { confirmationDialogReducer } from './slices/confirmationDialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const orchestratorStore: any = configureStore({
    reducer: {
        confirmationDialog: confirmationDialogReducer,
        [orchestratorApi.reducerPath]: orchestratorApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(orchestratorApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof orchestratorStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof orchestratorStore.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(orchestratorStore.dispatch);
