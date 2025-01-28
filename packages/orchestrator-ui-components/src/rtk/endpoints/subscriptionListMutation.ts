import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import { orchestratorApi, SubscriptionListResponse } from '@/rtk';
import { GraphqlQueryVariables } from '@/types';

const subscriptionListMutationApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        emptyQuery: builder.query<SubscriptionListResponse, GraphqlQueryVariables<SubscriptionListItem>>({ query: () => ({}), }),
        updateSubscriptionNoteOptimistic: builder.mutation<
            { mockResponse: boolean },
            { queryName: string, subscriptionId: string; graphQlQueryVariables: GraphqlQueryVariables<SubscriptionListItem>; note: string }
        >({
            queryFn: async () => ({ data: { mockResponse: true } }),
            async onQueryStarted({ queryName,  subscriptionId, graphQlQueryVariables, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    subscriptionListMutationApi.util.updateQueryData(queryName as 'emptyQuery', graphQlQueryVariables, (draft: SubscriptionListResponse) => {
                        const subscription = draft.subscriptions.find((item) => item.subscriptionId === subscriptionId
                        );
                        if (subscription) {
                            subscription.note = patch.note;
                        }
                    }));
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),
    }),
});

export const { useUpdateSubscriptionNoteOptimisticMutation } =
    subscriptionListMutationApi;
