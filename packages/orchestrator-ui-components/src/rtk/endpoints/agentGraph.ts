import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { GraphStructure } from '@/types/agentGraph';

const agentGraphApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getGraphStructure: build.query<GraphStructure, void>({
            query: () => ({
                url: '/agent/graph',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
                apiName: 'agent',
            },
        }),
    }),
});

export const { useGetGraphStructureQuery } = agentGraphApi;
