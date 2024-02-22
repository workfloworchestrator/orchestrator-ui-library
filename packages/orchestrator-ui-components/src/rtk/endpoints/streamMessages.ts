import { debounce } from 'lodash';

import { addToastMessage } from '@/rtk/slices/toastMessages';
import type { RootState } from '@/rtk/store';
import { ToastTypes } from '@/types';
import { getToastMessage } from '@/utils/getToastMessage';

import { CacheTags, orchestratorApi } from '../api';

const getWebSocket = (url: string) => {
    // TODO: Implement authentication taking this into account: https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api/77060459#77060459
    // https://github.com/workfloworchestrator/orchestrator-core/issues/502 - https://github.com/workfloworchestrator/orchestrator-ui-library/issues/823
    return new WebSocket(url);
};

const PING_INTERVAL_MS = 5000;
const DEBOUNCE_CLOSE_INTERVAL_MS = 10000;

/*
 * Websocket handling as recommended by RTK QUery see: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#streaming-data-with-no-initial-request
 * The websocket is opened after the cacheDataLoaded promise is resolved, and closed after the cacheEntryRemoved promise is resolved maintaining
 * the connection in between
 * - It sends a ping message every PING_INTERVAL ms to keep the connection alive
 * - It debounces the close event to avoid closing the connection every time a 'pong' message is received
 * - It closes the connection if any websocket error or close event is received
 * - It invalidates the cache entry with the tag received in the message event
 */
const streamMessagesApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        streamMessages: build.query<boolean, void>({
            queryFn: () => {
                return { data: false };
            },
            async onCacheEntryAdded(
                _,
                {
                    cacheDataLoaded,
                    cacheEntryRemoved,
                    dispatch,
                    getState,
                    updateCachedData,
                },
            ) {
                const cleanUp = () => {
                    const message = getToastMessage(
                        ToastTypes.ERROR,
                        'Connection to the server was lost. Please refresh the page to reconnect.',
                        'WebSocket closed',
                    );
                    dispatch(addToastMessage(message));
                    clearInterval(pingInterval);
                    updateCachedData(() => false);
                };

                await cacheDataLoaded;

                const state = getState() as RootState;
                const { orchestratorWebsocketUrl } = state.orchestratorConfig;

                // Starts the websocket
                const webSocket = getWebSocket(orchestratorWebsocketUrl);

                // Lets the WfoWebsocketStatusBadge know the websocket is connected
                webSocket.onopen = () => {
                    updateCachedData(() => true);
                };

                // Send a ping message every to the websocket server to keep the connection alive
                const pingInterval = setInterval(() => {
                    webSocket.send('ping');
                }, PING_INTERVAL_MS);

                const debounceCloseWebSocket = debounce(() => {
                    webSocket.close();
                }, DEBOUNCE_CLOSE_INTERVAL_MS);
                // Start the debounced function to close the websocket when no 'pong' message is received after DEBOUNCE_CLOSE_INTERVAL
                debounceCloseWebSocket();

                webSocket.addEventListener(
                    'message',
                    (message: MessageEvent<string>) => {
                        const tagOrPong = message.data.trim();

                        if (tagOrPong === 'pong') {
                            // Reset the debounced every time a 'pong' message is received
                            debounceCloseWebSocket();
                            return;
                        }

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
                    },
                );

                webSocket.onerror = (event) => {
                    console.error('WebSocket error', event);
                    cleanUp();
                };

                webSocket.onclose = () => {
                    console.error('WebSocket closed');
                    cleanUp();
                };

                await cacheEntryRemoved;

                webSocket.close();
            },
        }),
    }),
});

export const { useStreamMessagesQuery } = streamMessagesApi;
