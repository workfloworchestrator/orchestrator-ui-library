import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    Subscription,
    SubscriptionsResult,
} from '@/types';

export const subscriptionListQuery = `query SubscriptionsList(
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
                note
                startDate
                endDate
                description
                insync
                status
                subscriptionId
                product {
                    name
                    tag
                    productType
                }
                customer {
                    fullname
                    shortcode
                }
            }
            pageInfo {
                totalItems
                startCursor
                hasPreviousPage
                hasNextPage
                endCursor
                sortFields
                filterFields
            }
        }
    }
`;

export type SubscriptionListResponse = {
    subscriptions: Subscription[];
} & BaseGraphQlResult;

const subscriptionListApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionList: builder.query<
            SubscriptionListResponse,
            GraphqlQueryVariables<SubscriptionListItem>
        >({
            query: (variables) => ({
                document: subscriptionListQuery,
                variables,
            }),
            transformResponse: (response: SubscriptionsResult) => {
                const subscriptions = response.subscriptions.page || [];
                const pageInfo = response.subscriptions.pageInfo || {};

                return {
                    subscriptions,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetSubscriptionListQuery, useLazyGetSubscriptionListQuery } =
    subscriptionListApi;
