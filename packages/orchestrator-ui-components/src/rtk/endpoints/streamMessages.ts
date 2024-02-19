import { debounce } from 'lodash';

import { addToastMessage } from '@/rtk/slices/toastMessages';
import type { RootState } from '@/rtk/store';
import { ToastTypes } from '@/types';
import { getToastMessage } from '@/utils/getToastMessage';

import { CacheTags, orchestratorApi } from '../api';

const getWebSocket = (url: string) => {
    // TODO: Implement authentication taking this into account: https://stackoverflow.com/a/77060459o
    return new WebSocket(url);
};

const PING_INTERVAL = 5000;
const DEBOUNCE_CLOSE_INTERVAL = 10000;

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
                const webSocket = getWebSocket(orchestratorWebsocketUrl);

                const pingInterval = setInterval(() => {
                    webSocket.send('ping');
                }, PING_INTERVAL);

                const closeWebSocket = () => {
                    webSocket.close();
                };
                const debounceCloseWebSocket = debounce(
                    closeWebSocket,
                    DEBOUNCE_CLOSE_INTERVAL,
                );
                debounceCloseWebSocket();

                webSocket.addEventListener(
                    'message',
                    (message: MessageEvent<string>) => {
                        const tagOrPong = message.data.trim();

                        if (tagOrPong === 'pong') {
                            debounceCloseWebSocket();
                        } else {
                            const tagToInvalidate = tagOrPong as CacheTags;
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
                    clearInterval(pingInterval);
                };

                await cacheEntryRemoved;

                webSocket.close();
            },
        }),
    }),
});

export const { useStreamMessagesQuery } = streamMessagesApi;
