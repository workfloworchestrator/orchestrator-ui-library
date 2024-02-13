import { CacheTags, orchestratorApi } from '../api';

// From https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#streaming-data-with-no-initial-request
const streamMessagesApi = orchestratorApi.injectEndpoints({
    endpoints: (build, api) => ({
        streamMessages: build.query({
            queryFn: () => {
                return { data: [] };
            },
            async onCacheEntryAdded(
                arg,
                { cacheDataLoaded, cacheEntryRemoved, dispatch },
            ) {
                await cacheDataLoaded;

                const webSocket = new WebSocket('ws://127.0.0.1:8888/');

                // populate the array with messages as they are received from the websocket
                webSocket.addEventListener(
                    'message',
                    (message: MessageEvent<string>) => {
                        const tagToInvalidate =
                            message.data as CacheTags as string;
                        // const validCacheTags = Object.values(CacheTags);
                        const validCacheTags: string[] = [
                            'engineStatus',
                            'testStatus',
                        ];
                        console.log(
                            tagToInvalidate,
                            validCacheTags,
                            typeof tagToInvalidate,
                            typeof validCacheTags,
                        );
                        console.log(validCacheTags.includes(tagToInvalidate));
                        if (
                            tagToInvalidate &&
                            validCacheTags.indexOf(tagToInvalidate) !== -1
                        ) {
                            const cacheInvalidationAction =
                                api.util.invalidateTags([tagToInvalidate]);
                            dispatch(cacheInvalidationAction);
                            console.log(
                                'invalidateTags: ' + tagToInvalidate,
                                validCacheTags,
                            );
                        } else {
                            console.error(
                                `Trying to invalidate a cache entry with an unknown tag: ${tagToInvalidate}`,
                                validCacheTags,
                            );
                        }
                    },
                );

                webSocket.onerror = (event) => {
                    console.error('WebSocket error observed:', event);
                };
                webSocket.onopen = () => {
                    webSocket.send('start');
                };
                await cacheEntryRemoved;
                webSocket.close();
            },
        }),
    }),
});

export const { useStreamMessagesQuery } = streamMessagesApi;
