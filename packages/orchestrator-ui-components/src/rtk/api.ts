import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import type { RootState } from './store';

export enum BaseQueryTypes {
    fetch = 'fetch',
    graphql = 'graphql',
    custom = 'custom',
}

type ExtraOptions = {
    baseQueryType?: BaseQueryTypes;
};

export const orchestratorApi = createApi({
    reducerPath: 'orchestratorApi',
    baseQuery: (args, api, extraOptions: ExtraOptions) => {
        const { baseQueryType } = extraOptions || {};

        const state = api.getState() as RootState;
        const { orchestratorApiBaseUrl, graphqlEndpointCore } =
            state.orchestratorConfig;

        switch (baseQueryType) {
            case BaseQueryTypes.fetch:
                const fetchFn = fetchBaseQuery({
                    baseUrl: orchestratorApiBaseUrl,
                });
                return fetchFn(args, api, {});
            default:
                const graphqlFn = graphqlRequestBaseQuery({
                    url: graphqlEndpointCore,
                });
                return graphqlFn(args, api, {});
        }
    },
    endpoints: () => ({}),
    tagTypes: ['engineStatus'],
});
