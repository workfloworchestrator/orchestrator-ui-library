import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { GraphQLPageInfo } from '@/types';

export type AgentExportResponse = {
  page: object[];
  pageInfo?: GraphQLPageInfo;
};

const agentExportApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentExport: builder.query<AgentExportResponse, string>({
      query: (downloadUrl) => ({
        url: downloadUrl,
        method: 'GET',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const { useLazyGetAgentExportQuery } = agentExportApi;
