import { addToastMessage } from '@/rtk/slices/toastMessages';
import type { RootState } from '@/rtk/store';
import { ToastTypes } from '@/types';
import { getToastMessage } from '@/utils/getToastMessage';

import { CacheTags, orchestratorApi } from '../api';

// From https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#streaming-data-with-no-initial-request
const streamMessagesApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        streamMessages: build.query({
            queryFn: () => {
                return { data: [] };
            },
            async onCacheEntryAdded(
                _,
                { cacheDataLoaded, cacheEntryRemoved, dispatch, getState },
            ) {
                await cacheDataLoaded;

                const state = getState() as RootState;
                const { orchestratorWebsocketUrl } = state.orchestratorConfig;

                const webSocket = new WebSocket(orchestratorWebsocketUrl);

                // populate the array with messages as they are received from the websocket
                webSocket.addEventListener(
                    'message',
                    (message: MessageEvent<string>) => {
                        const tagToInvalidate =
                            message.data.trim() as CacheTags;
                        const validCacheTags = Object.values(CacheTags);

                        if (
                            tagToInvalidate &&
                            validCacheTags.includes(tagToInvalidate)
                        ) {
                            const cacheInvalidationAction =
                                orchestratorApi.util.invalidateTags([
                                    tagToInvalidate,
                                ]);
                            dispatch(cacheInvalidationAction);
                        } else {
                            console.error(
                                `Trying to invalidate a cache entry with an unknown tag: ${tagToInvalidate}`,
                            );
                        }
                    },
                );

                webSocket.onerror = (event) => {
                    console.error('WebSocket error', event);
                };
                webSocket.onopen = () => {
                    webSocket.send('start');
                };
                webSocket.onclose = () => {
                    const message = getToastMessage(
                        ToastTypes.ERROR,
                        'Connection to the server was lost. Please refresh the page to reconnect.',
                        'WebSocket closed',
                    );
                    dispatch(addToastMessage(message));
                };
                await cacheEntryRemoved;
                webSocket.close();
            },
        }),
    }),
});

export const { useStreamMessagesQuery } = streamMessagesApi;
