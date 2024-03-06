import { getSession } from 'next-auth/react';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import type { WfoSession } from '@/hooks';

import type { RootState } from './store';

export enum BaseQueryTypes {
    fetch = 'fetch',
    graphql = 'graphql',
    custom = 'custom',
}

export enum CacheTags {
    engineStatus = 'engineStatus',
    // This is a placeholder for now. Having only one messes up the type of the tag in the onCacheEntryAdded function.
    testStatus = 'testStatus',
}

type ExtraOptions = {
    baseQueryType?: BaseQueryTypes;
    customBaseQueryType?: string;
};

export const prepareHeaders = async (headers: Headers) => {
    const session = (await getSession()) as WfoSession;
    if (session?.accessToken) {
        headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
    return headers;
};

export const orchestratorApi = createApi({
    reducerPath: 'orchestratorApi',
    baseQuery: (args, api, extraOptions: ExtraOptions) => {
        const { baseQueryType, customBaseQueryType } = extraOptions || {};

        const state = api.getState() as RootState;
        const { orchestratorApiBaseUrl, graphqlEndpointCore } =
            state.orchestratorConfig;
        const baseQueries = state.customBaseQueries;
        console.log('baseQueries', baseQueries);
        if (baseQueries) {
            for (const query of baseQueries) {
                if (query.queryType === customBaseQueryType) {
                    return query.customFn(args, api, {});
                }
            }
        }
        switch (baseQueryType) {
            case BaseQueryTypes.fetch:
                const fetchFn = fetchBaseQuery({
                    baseUrl: orchestratorApiBaseUrl,
                    prepareHeaders,
                });
                return fetchFn(args, api, {});
            default:
                const graphqlFn = graphqlRequestBaseQuery({
                    url: graphqlEndpointCore,
                    prepareHeaders,
                });
                return graphqlFn(args, api, {});
        }
    },
    endpoints: () => ({}),
    tagTypes: [CacheTags.engineStatus, CacheTags.testStatus],
});
