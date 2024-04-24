import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import { CacheTags, orchestratorApi } from '@/rtk';
import {
    InUseByRelationDetail,
    InUseByRelationsDetailResult,
    SubscriptionStatus,
} from '@/types';

const nonTerminalSubscriptionStatuses = [
    SubscriptionStatus.INITIAL,
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.MIGRATING,
    SubscriptionStatus.DISABLED,
    SubscriptionStatus.PROVISIONING,
].join('|');

export const subscriptionInUseByRelationQuery = `
    query SubscriptionsInUseByRelationsDetails(
        $subscriptionIds: String!
    ) {
        subscriptions(
            first: ${NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS}
            after: 0
            filterBy: [{field: "subscriptionId", value: $subscriptionIds},{field: "status", value: "${nonTerminalSubscriptionStatuses}"}]
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
