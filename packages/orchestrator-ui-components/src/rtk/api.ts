import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const orchestratorApi = createApi({
    reducerPath: 'orchestratorApi',
    baseQuery: graphqlRequestBaseQuery({
        // baseUrl: 'https://orchestrator.dev.automation.surf.net',
        url: 'https://orchestrator.dev.automation.surf.net/api/graphql',
    }),
    endpoints: () => ({}),
});
