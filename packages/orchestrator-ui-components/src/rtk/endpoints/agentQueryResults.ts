import { SEARCH_QUERY_RESULTS_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { QueryResultsData } from '@/types';

const agentQueryResultsApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentQueryResults: builder.query<QueryResultsData, string>({
      query: (queryId) => ({
        url: `${SEARCH_QUERY_RESULTS_ENDPOINT}/${queryId}/results`,
        method: 'GET',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const { useGetAgentQueryResultsQuery } = agentQueryResultsApi;
