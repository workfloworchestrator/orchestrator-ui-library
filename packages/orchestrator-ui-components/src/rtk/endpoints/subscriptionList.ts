import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    CacheTagType,
    GraphqlQueryVariables,
    Subscription,
    SubscriptionsResult,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

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
                metadata
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
            transformResponse: (
                response: SubscriptionsResult,
            ): SubscriptionListResponse => {
                const subscriptions = response.subscriptions.page || [];
                const pageInfo = response.subscriptions.pageInfo || {};

                return {
                    subscriptions,
                    pageInfo,
                };
            },
            providesTags: getCacheTag(CacheTagType.subscriptions),
        }),
        updateSubscriptionNoteLocally: builder.mutation<
            void,
            { subscriptionId: string; graphQlQueryVariables: GraphqlQueryVariables<SubscriptionListItem>; note: string }
        >({
            queryFn: async () => {
                return { data: undefined };
            },
            async onQueryStarted({ subscriptionId, graphQlQueryVariables, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    subscriptionListApi.util.updateQueryData('getSubscriptionList', graphQlQueryVariables, (draft) => {
                        const subscription = draft.subscriptions.find(
                            (item) => item.subscriptionId === subscriptionId
                        );
                        if (subscription) {
                            subscription.note = patch.note;
                        }
                    }));
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()

                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            },
        }),
    }),
});

export const { useGetSubscriptionListQuery, useLazyGetSubscriptionListQuery, useUpdateSubscriptionNoteLocallyMutation } =
    subscriptionListApi;
