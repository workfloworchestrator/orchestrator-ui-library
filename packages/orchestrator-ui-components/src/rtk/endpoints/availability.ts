import { BaseQueryTypes, orchestratorApi } from '@/rtk';

type AvailabilityCheckResponse = Record<string, unknown>;

const availabilityApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        checkSearchAvailability: build.query<AvailabilityCheckResponse, void>({
            query: () => ({
                url: 'search/definitions',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        checkAgentAvailability: build.query<AvailabilityCheckResponse, void>({
            query: () => ({
                url: '/agent/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [],
                }),
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
                apiName: 'agent',
            },
        }),
    }),
});

export const {
    useCheckSearchAvailabilityQuery,
    useCheckAgentAvailabilityQuery,
} = availabilityApi;
