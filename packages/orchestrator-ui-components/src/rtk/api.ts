import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

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

        switch (baseQueryType) {
            case BaseQueryTypes.fetch:
                const fetchFn = fetchBaseQuery({
                    baseUrl: 'https://orchestrator.dev.automation.surf.net/api',
                });
                return fetchFn(args, api, {});
            default:
                const graphqlFn = graphqlRequestBaseQuery({
                    // baseUrl: 'https://orchestrator.dev.automation.surf.net',
                    url: 'https://orchestrator.dev.automation.surf.net/api/graphql',
                });
                return graphqlFn(args, api, {});
        }
    },
    endpoints: () => ({}),
    tagTypes: ['engineStatus'],
});
