import { debounce } from 'lodash';
import { getSession } from 'next-auth/react';

import type { WfoSession } from '@/hooks';
import { addToastMessage } from '@/rtk/slices/toastMessages';
import type { RootState } from '@/rtk/store';
import { ToastTypes } from '@/types';
import { getToastMessage } from '@/utils/getToastMessage';

import { CacheTags, orchestratorApi } from '../api';

const getWebSocket = async (url: string) => {
    const session = (await getSession()) as WfoSession;

    const token = session?.accessToken
        ? ['base64.bearer.token', session?.accessToken]
        : '';
    // Implemented authentication taking this into account: https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api/77060459#77060459
    return new WebSocket(url, token);
};

const PING_INTERVAL_MS = 45000; // Recommended values are between 30 and 60 seconds
const DEBOUNCE_CLOSE_INTERVAL_MS = 60000;

type WebSocketMessage = {
    name: MessageTypes;
    value: string[] | string;
};

type CacheInvalidationTag = CacheTags | { type: CacheTags; id: string };

enum MessageTypes {
    invalidateCache = 'invalidateCache',
}
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
                        'Connection to the server was lost. Please click the websocket icon or refresh the page to reconnect.',
                        'WebSocket closed',
                    );
                    dispatch(addToastMessage(message));
                    clearInterval(pingInterval);
                    updateCachedData(() => false);
                };

                const invalidateTag = (cacheTag: CacheTags, id?: string) => {
                    if (validCacheTags.includes(cacheTag)) {
                        // If we receive an object with cacheTag and id we both invalidate the cache key and the cache key with the id
                        // invalidating both the general and specific caches
                        const cacheTags: CacheInvalidationTag[] = [cacheTag];

                        if (id) {
                            cacheTags.push({
                                type: cacheTag,
                                id,
                            });
                        }

                        const cacheInvalidationAction =
                            orchestratorApi.util.invalidateTags(cacheTags);
                        dispatch(cacheInvalidationAction);
                    } else {
                        console.error(
                            `Trying to invalidate a cache entry with an unknown tag: ${cacheTag}`,
                        );
                    }
                };

                const handleInvalidateCacheMessage = (
                    message: WebSocketMessage,
                ) => {
                    if (message.name === MessageTypes.invalidateCache) {
                        const messageValue = message.value;

                        if (typeof messageValue === 'string') {
                            invalidateTag(messageValue as CacheTags);
                        } else if (
                            Array.isArray(messageValue) &&
                            messageValue.length === 2
                        ) {
                            const [tag, id] = messageValue;
                            const cacheTag = tag as CacheTags;
                            invalidateTag(cacheTag, id);
                        } else {
                            console.error(
                                'invalid message value type',
                                messageValue,
                            );
                        }
                    }
                };

                // Send a ping message every to the websocket server to keep the connection alive
                const pingInterval = setInterval(() => {
                    webSocket.send('__ping__');
                }, PING_INTERVAL_MS);

                const debounceCloseWebSocket = debounce(() => {
                    webSocket.close();
                }, DEBOUNCE_CLOSE_INTERVAL_MS);
                // Start the debounced function to close the websocket when no 'pong' message is received after DEBOUNCE_CLOSE_INTERVAL
                debounceCloseWebSocket();

                await cacheDataLoaded;

                const state = getState() as RootState;
                const { orchestratorWebsocketUrl } = state.orchestratorConfig;
                const validCacheTags = Object.values(CacheTags);

                // Starts the websocket
                const webSocket = await getWebSocket(orchestratorWebsocketUrl);

                // Lets the WfoWebsocketStatusBadge know the websocket is connected
                webSocket.onopen = () => {
                    updateCachedData(() => true);
                };

                webSocket.addEventListener(
                    'message',
                    (messageEvent: MessageEvent<string>) => {
                        const data = messageEvent.data;

                        if (data === '__pong__') {
                            // Reset the debounced every time a 'pong' message is received
                            debounceCloseWebSocket();
                            return;
                        }
                        const message = JSON.parse(data) as WebSocketMessage;
                        handleInvalidateCacheMessage(message);
                    },
                );

                webSocket.onerror = (event) => {
                    console.error('WebSocket error', event);
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
