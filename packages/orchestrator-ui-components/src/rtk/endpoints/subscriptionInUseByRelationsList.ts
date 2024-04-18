import { CacheTags, orchestratorApi } from '@/rtk';
import { InUseByRelationDetail, InUseByRelationsDetailResult } from '@/types';

export const subscriptionInUseByRelationQuery = `
    query SubscriptionsInUseByRelationsDetails(
        $subscriptionIds: String!
    ) {
        subscriptions(
            first: 1000000
            after: 0
            filterBy: [{field: "subscriptionId", value: $subscriptionIds},{field: "status", value: "INITIAL|ACTIVE|MIGRATING|DISABLED|PROVISIONING"}]
          ) {
            page {
              product {
                name
              }
              description
              subscriptionId
              status
            }
          }
    }
`;

export type InUseByRelationsDetailResponse = {
    inUseByRelationDetails: InUseByRelationDetail[];
};

const subscriptionInUseByRelationsListApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getInUseByRelationDetails: builder.query<
            InUseByRelationsDetailResponse,
            { subscriptionIds: string }
        >({
            query: (variables) => ({
                document: subscriptionInUseByRelationQuery,
                variables,
            }),
            transformResponse: (
                response: InUseByRelationsDetailResult,
            ): InUseByRelationsDetailResponse => {
                const subscriptions = response.subscriptions.page || [];

                return {
                    inUseByRelationDetails: subscriptions,
                };
            },
            providesTags: [CacheTags.subscriptionList],
        }),
    }),
});

export const { useGetInUseByRelationDetailsQuery } =
    subscriptionInUseByRelationsListApi;
