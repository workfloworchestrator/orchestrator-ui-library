import { debounce } from 'lodash';
import { getSession } from 'next-auth/react';

import type { WfoSession } from '@/hooks';
import type { RootState } from '@/rtk/store';
import { CacheTag, CacheTagType } from '@/types';

import { orchestratorApi } from '../api';

const getWebSocket = async (url: string) => {
    const session = (await getSession()) as WfoSession;

    if (session?.accessToken) {
        // Implemented authentication taking this into account: https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api/77060459#77060459
        return new WebSocket(url, [
            'base64.bearer.token',
            session?.accessToken,
        ]);
    } else {
        return new WebSocket(url);
    }
};

const PING_INTERVAL_MS = 30000;
const NO_PONG_RECEIVED_TIMEOUT_MS = 35000;
const INITIAL_CONNECTION_CHECK_INTERVAL_MS = 2000;

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
 * - It sends a ping message right after the connection is established. If no pong is received within INITIAL_CONNECTION_CHECK_INTERVAL_MS the connection
 * is considered lost
 * - It sends a ping message every PING_INTERVAL ms to keep the connection alive. It no pong is received withing NO_PONG_RECEIVED_TIMEOUT_MS the connection
 * is considered lost
 * - It debounces the close event to avoid closing the connection every time a 'pong' message is received
 * - It closes the connection if any websocket error or close event is received
 * - It invalidates the cache entry with the tag received in the message event
 * - WfoWebsocketStatusBadge contains logic that handles automatic reconnection and their circumstances
 */
const streamMessagesApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        streamMessages: build.query<boolean, void>({
            queryFn: () => {
                return { data: true };
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
                    clearInterval(pingInterval);
                    updateCachedData(() => false);
                };

                const invalidateTag = (cacheTag: CacheTag) => {
                    if (validCacheTags.includes(cacheTag.type)) {
                        const cacheInvalidationAction =
                            orchestratorApi.util.invalidateTags([cacheTag]);
                        dispatch(cacheInvalidationAction);
                    } else {
                        console.error(
                            `Trying to invalidate a cache entry with an unknown tag: ${cacheTag.type}`,
                        );
                    }
                };

                await cacheDataLoaded;
                let initialConnection = true;
                const state = getState() as RootState;
                const { orchestratorWebsocketUrl } = state.orchestratorConfig;
                const validCacheTags = Object.values(CacheTagType);

                const getDebounce = (delay: number) => {
                    return debounce(() => {
                        webSocket.close();
                        // note: websocket.close doesn't trigger the onClose handler when closing
                        // internet connection so we call the cleanup event from here to be sure it's called
                        cleanUp();
                    }, delay);
                };

                const closeConnectionAfterFirstPing = getDebounce(
                    INITIAL_CONNECTION_CHECK_INTERVAL_MS,
                );
                const debounceClosingConnection = getDebounce(
                    NO_PONG_RECEIVED_TIMEOUT_MS,
                );

                // Starts the websocket
                const webSocket = await getWebSocket(orchestratorWebsocketUrl);

                const sendPing = () => {
                    if (webSocket.readyState === WebSocket.OPEN) {
                        webSocket.send('__ping__');
                    }
                };

                // Send a ping message every to the websocket server to keep the connection alive
                // Note: setInterval doesn't keep their set interval when the browser suspends. It will
                // run less frequently at the discretion of the browser causing the websocket to disconnect
                // sometimes. WfoWebsocketStatusBadge contains logic to reconnect based on the pageVisibility api
                // to handle that situation.
                const pingInterval = setInterval(() => {
                    sendPing();
                }, PING_INTERVAL_MS);

                webSocket.onopen = () => {
                    // Check the connection right after it is established
                    closeConnectionAfterFirstPing();
                    sendPing();
                    debounceClosingConnection();
                    // Lets the WfoWebsocketStatusBadge know the websocket is connected
                    updateCachedData(() => true);
                };

                webSocket.addEventListener(
                    'message',
                    (messageEvent: MessageEvent<string>) => {
                        const data = messageEvent.data;

                        if (data === '__pong__') {
                            debounceClosingConnection();
                            if (
                                initialConnection &&
                                closeConnectionAfterFirstPing
                            ) {
                                initialConnection = false;
                                closeConnectionAfterFirstPing.cancel();
                            }
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

export const { useStreamMessagesQuery, useLazyStreamMessagesQuery } =
    streamMessagesApi;
