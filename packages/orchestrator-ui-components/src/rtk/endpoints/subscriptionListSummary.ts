import { orchestratorApi } from '@/rtk';
import { CacheTagType } from '@/types';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    Subscription,
    SubscriptionSummary,
    SubscriptionsResult,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

export const subscriptionListSummaryQuery = `
    query SubscriptionsList(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
        $query: String
    ) {
        subscriptions(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
            query: $query
        ) {
            page {
                startDate
                description
                subscriptionId
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
    }
`;

export type SubscriptionListSummaryResponse = {
    subscriptions: SubscriptionSummary[];
} & BaseGraphQlResult;

const subscriptionListSummaryApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionSummaryList: builder.query<
            SubscriptionListSummaryResponse,
            GraphqlQueryVariables<Subscription>
        >({
            query: (variables) => ({
                document: subscriptionListSummaryQuery,
                variables,
            }),
            transformResponse: (
                response: SubscriptionsResult<SubscriptionSummary>,
            ): SubscriptionListSummaryResponse => {
                const subscriptions = response.subscriptions.page || [];
                const pageInfo = response.subscriptions.pageInfo || {};

                return {
                    subscriptions,
                    pageInfo,
                };
            },
            providesTags: getCacheTag(CacheTagType.subscriptions),
        }),
    }),
});

export const { useGetSubscriptionSummaryListQuery } =
    subscriptionListSummaryApi;
