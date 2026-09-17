import { SubscriptionDetailResponse, SubscriptionListResponse, orchestratorApi } from '@/rtk';
import { PaginatedSearchResults } from '@/types';

const SEARCH_NOTE_COLUMN = 'subscription.note';
const SEARCH_ID_COLUMN = 'subscription.subscription_id';

// The note edit is rendered by both the GraphQL based lists (surf NMS pages) and the search based
// subscriptions list, whose cached responses have a different shape. The draft is inspected
// instead of typed per caller so the note edit needs no knowledge of the query behind it.
const patchNoteInListDraft = (
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

const SEARCH_ENDPOINT_NAME = 'search';

const subscriptionListMutationApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSubscriptionNoteOptimistic: builder.mutation<
      { mockResponse: boolean },
      {
        subscriptionId: string;
        note: string;
        // Cache key of a GraphQL list query showing the note (surf NMS pages). The search based
        // subscriptions list needs no key: every cached search result set is patched.
        listQuery?: { queryName: string; queryVariables: object };
      }
    >({
      queryFn: async () => ({ data: { mockResponse: true } }),
      // Patches the detail cache, all cached search result sets and the optional GraphQL list so
      // the note stays consistent when navigating between pages. updateQueryData is a no-op for
      // a cache entry that does not exist, and patching the same entry twice is harmless.
      async onQueryStarted({ subscriptionId, note, listQuery }, { dispatch, getState, queryFulfilled }) {
        const patchList = (queryName: string, queryVariables: object) =>
          dispatch(
            subscriptionListMutationApi.util.updateQueryData(
              // @ts-expect-error - queryName is a runtime string, not a known endpoint name
              queryName,
              queryVariables,
              (draft: SubscriptionListResponse | PaginatedSearchResults) =>
                patchNoteInListDraft(draft, subscriptionId, note),
            ),
          );

        const cachedSearchArgs = subscriptionListMutationApi.util.selectCachedArgsForQuery(
          getState(),
          // @ts-expect-error - search is injected by another slice, unknown to this one
          SEARCH_ENDPOINT_NAME,
        ) as object[];

        const patchResults = [
          dispatch(
            subscriptionListMutationApi.util.updateQueryData(
              // @ts-expect-error - getSubscriptionDetail is injected by another slice, unknown to this one
              'getSubscriptionDetail',
              { subscriptionId },
              (draft: SubscriptionDetailResponse) => {
                if (draft?.subscription) {
                  draft.subscription.note = note;
                }
              },
            ),
          ),
          ...cachedSearchArgs.map((searchArgs) => patchList(SEARCH_ENDPOINT_NAME, searchArgs)),
          ...(listQuery ? [patchList(listQuery.queryName, listQuery.queryVariables)] : []),
        ];

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      },
    }),
  }),
});

export const { useUpdateSubscriptionNoteOptimisticMutation } = subscriptionListMutationApi;
