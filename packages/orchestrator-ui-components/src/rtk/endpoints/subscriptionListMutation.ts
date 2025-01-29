import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import {
    SubscriptionDetailResponse,
    SubscriptionListResponse,
    orchestratorApi,
} from '@/rtk';
import { GraphqlQueryVariables } from '@/types';

const subscriptionListMutationApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        emptyQuery: builder.query<
            SubscriptionListResponse,
            GraphqlQueryVariables<SubscriptionListItem>
        >({ query: () => ({}) }),
        emptyDetailQuery: builder.query<
            SubscriptionDetailResponse,
            { subscriptionId: string }
        >({ query: () => ({}) }),
        updateSubscriptionNoteOptimistic: builder.mutation<
            { mockResponse: boolean },
            {
                queryName: string;
                subscriptionId: string;
                graphQlQueryVariables: GraphqlQueryVariables<SubscriptionListItem>;
                note: string;
            }
        >({
            queryFn: async () => ({ data: { mockResponse: true } }),
            async onQueryStarted(
                { queryName, subscriptionId, graphQlQueryVariables, ...patch },
                { dispatch, queryFulfilled },
            ) {
                const patchResult = dispatch(
                    subscriptionListMutationApi.util.updateQueryData(
                        // @ts-expect-error - Suggest ts ignore because of the type mismatch between emptyQuery and queryName
                        queryName,
                        graphQlQueryVariables,
                        (draft: SubscriptionListResponse) => {
                            const subscription = draft.subscriptions.find(
                                (item) =>
                                    item.subscriptionId === subscriptionId,
                            );
                            if (subscription) {
                                subscription.note = patch.note;
                            }
                        },
                    ),
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateSubscriptionDetailNoteOptimistic: builder.mutation<
            { mockResponse: boolean },
            { queryName: string; subscriptionId: string; note: string }
        >({
            queryFn: async () => ({ data: { mockResponse: true } }),
            async onQueryStarted(
                { queryName, subscriptionId, ...patch },
                { dispatch, queryFulfilled },
            ) {
                const patchResult = dispatch(
                    subscriptionListMutationApi.util.updateQueryData(
                        // @ts-expect-error - Suggest ts ignore because of the type mismatch between emptyDetailQuery and queryName
                        queryName,
                        { subscriptionId: subscriptionId },
                        (draft: SubscriptionDetailResponse) => {
                            if (draft) {
                                draft.subscription.note = patch.note;
                            }
                        },
                    ),
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useUpdateSubscriptionNoteOptimisticMutation,
    useUpdateSubscriptionDetailNoteOptimisticMutation,
} = subscriptionListMutationApi;
