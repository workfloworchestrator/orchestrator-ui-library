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
  }),
});

export const { useCheckSearchAvailabilityQuery } = availabilityApi;
