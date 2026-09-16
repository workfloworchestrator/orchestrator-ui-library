import { SubscriptionDetailResponse, SubscriptionListResponse, orchestratorApi } from '@/rtk';
import { PaginatedSearchResults } from '@/types';

const SEARCH_NOTE_COLUMN = 'subscription.note';
const SEARCH_ID_COLUMN = 'subscription.subscription_id';

// The note edit is rendered by both the GraphQL based lists (surf NMS pages) and the search based
// subscriptions list, whose cached responses have a different shape. The draft is inspected
// instead of typed per caller so the note edit needs no knowledge of the query behind it.
const patchNoteInDraft = (
  draft: SubscriptionListResponse | PaginatedSearchResults,
  subscriptionId: string,
  note: string,
) => {
  if ('subscriptions' in draft) {
    const subscription = draft.subscriptions.find((item) => item.subscriptionId === subscriptionId);
    if (subscription) {
      subscription.note = note;
    }
    return;
  }
  const searchResult = draft.data?.find(
    ({ response_columns }) => response_columns[SEARCH_ID_COLUMN] === subscriptionId,
  );
  if (searchResult) {
    searchResult.response_columns[SEARCH_NOTE_COLUMN] = note;
  }
};

const subscriptionListMutationApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSubscriptionNoteOptimistic: builder.mutation<
      { mockResponse: boolean },
      {
        queryName: string;
        subscriptionId: string;
        queryVariables: object;
        note: string;
      }
    >({
      queryFn: async () => ({ data: { mockResponse: true } }),
      async onQueryStarted({ queryName, subscriptionId, queryVariables, note }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionListMutationApi.util.updateQueryData(
            // @ts-expect-error - queryName is a runtime string, not a known endpoint name
            queryName,
            queryVariables,
            (draft: SubscriptionListResponse | PaginatedSearchResults) => patchNoteInDraft(draft, subscriptionId, note),
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
      async onQueryStarted({ queryName, subscriptionId, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionListMutationApi.util.updateQueryData(
            // @ts-expect-error - queryName is a runtime string, not a known endpoint name
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

export const { useUpdateSubscriptionNoteOptimisticMutation, useUpdateSubscriptionDetailNoteOptimisticMutation } =
  subscriptionListMutationApi;
