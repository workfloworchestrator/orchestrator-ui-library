import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { QueryResultsData } from '@/types';

const agentQueryResultsApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentQueryResults: builder.query<QueryResultsData, string>({
      query: (queryId) => ({
        url: `search/queries/${queryId}/results`,
        method: 'GET',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const { useGetAgentQueryResultsQuery } = agentQueryResultsApi;
