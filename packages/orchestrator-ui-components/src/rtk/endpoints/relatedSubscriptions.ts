import {
    BaseGraphQlResult,
    RelatedSubscription,
    RelatedSubscriptionsResult,
    Subscription,
} from '@/types';

import { orchestratorApi } from '../api';

export const RelatedSubscriptionsQuery = `
query RelatedSubscriptions(
    $subscriptionId: String!
    $first: Int!
    $after: Int!
    $sortBy: [GraphqlSort!]
    $terminatedSubscriptionFilter: [GraphqlFilter!]
) {
    subscriptions(
        filterBy: { value: $subscriptionId, field: "subscriptionId" }
    ) {
        page {
            subscriptionId
            inUseBySubscriptions(
                first: $first
                after: $after
                sortBy: $sortBy
                filterBy: $terminatedSubscriptionFilter
            ) {
                page {
                    subscriptionId
                    customer {
                        fullname
                    }
                    description
                    insync
                    startDate
                    status
                    product {
                        tag
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    totalItems
                    sortFields
                    filterFields
                }
            }
        }
    }
}
`;

export type RelatedSubscriptionsResponse = {
    relatedSubscriptions: RelatedSubscription[];
} & BaseGraphQlResult;

const relatedSubscriptionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getRelatedSubscriptions: build.query<
            RelatedSubscriptionsResponse,
            Subscription['subscriptionId']
        >({
            query: (processName) => ({
                document: RelatedSubscriptionsQuery,
                variables: { processName },
            }),
            transformResponse: (
                result: RelatedSubscriptionsResult,
            ): RelatedSubscriptionsResponse => {
                const relatedSubscriptionResultForSubscription =
                    result.subscriptions.page[0] || [];
                const relatedSubscriptions =
                    relatedSubscriptionResultForSubscription
                        .inUseBySubscriptions.page || [];
                const pageInfo =
                    relatedSubscriptionResultForSubscription
                        .inUseBySubscriptions.pageInfo || {};

                return {
                    relatedSubscriptions,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetRelatedSubscriptionsQuery } = relatedSubscriptionsApi;
