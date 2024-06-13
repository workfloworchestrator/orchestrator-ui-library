import { debounce } from 'lodash';
import { getSession } from 'next-auth/react';

import type { WfoSession } from '@/hooks';
import { addToastMessage } from '@/rtk/slices/toastMessages';
import type { RootState } from '@/rtk/store';
import { ToastTypes } from '@/types';
import { CacheTag, CacheTagTypes } from '@/types';
import { getToastMessage } from '@/utils/getToastMessage';

import { orchestratorApi } from '../api';

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
    value: CacheTag;
};

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

                const invalidateTag = (cacheTag: CacheTag) => {
                    const tagType = (() => {
                        if (typeof cacheTag === 'object') {
                            return cacheTag.type;
                        }
                        return cacheTag;
                    })();

                    if (validCacheTags.includes(tagType)) {
                        const cacheInvalidationAction =
                            orchestratorApi.util.invalidateTags([
                                cacheTag,
                                CacheTagTypes.processes,
                            ]);
                        dispatch(cacheInvalidationAction);
                    } else {
                        console.error(
                            `Trying to invalidate a cache entry with an unknown tag: ${tagType}`,
                        );
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
                const validCacheTags = Object.values(CacheTagTypes);

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
                        if (message.name === MessageTypes.invalidateCache) {
                            invalidateTag(message.value);
                        } else {
                            console.error('Unknown message type', message);
                        }
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
