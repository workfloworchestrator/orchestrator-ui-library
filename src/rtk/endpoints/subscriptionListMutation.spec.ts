import { configureStore } from '@reduxjs/toolkit';

import { orchestratorApi } from '@/rtk/api';
import { EntityKind, PaginatedSearchResults } from '@/types';

// Importing the endpoint modules injects them into orchestratorApi
import './search';
import './subscriptionDetail';
import './subscriptionListMutation';

const SUBSCRIPTION_ID = 'sub-1';
const OTHER_SUBSCRIPTION_ID = 'sub-2';

// The injected endpoints are not part of orchestratorApi's static type, hence the casts below
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = orchestratorApi as any;

const searchResponse = (note: string): PaginatedSearchResults => ({
  data: [SUBSCRIPTION_ID, OTHER_SUBSCRIPTION_ID].map((id) => ({
    entity_id: id,
    entity_type: EntityKind.SUBSCRIPTION,
    entity_title: id,
    score: 1,
    perfect_match: 1,
    response_columns: { 'subscription.subscription_id': id, 'subscription.note': note },
  })),
  cursor: null,
  page_info: { has_next_page: false, next_page_cursor: null },
  search_metadata: { search_type: null, description: null },
});

const getSearchPayload = (query: string) => ({
  query,
  limit: 10,
  entity_type: EntityKind.SUBSCRIPTION,
  response_columns: [],
});

const getNotesFromSearchCache = (state: unknown, payload: object): string[] =>
  api.endpoints.search
    .select(payload)(state)
    .data.data.map(
      ({ response_columns }: PaginatedSearchResults['data'][number]) => response_columns['subscription.note'],
    );

describe('updateSubscriptionNoteOptimistic', () => {
  it('patches the note in every cached search result set and in the detail cache', async () => {
    const store = configureStore({
      reducer: { [orchestratorApi.reducerPath]: orchestratorApi.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(orchestratorApi.middleware),
    });
    const firstSearch = getSearchPayload('first');
    const secondSearch = getSearchPayload('second');
    const detailArgs = { subscriptionId: SUBSCRIPTION_ID };

    // upsertQueryData resolves asynchronously through the query thunk
    await Promise.all([
      store.dispatch(api.util.upsertQueryData('search', firstSearch, searchResponse('old'))),
      store.dispatch(api.util.upsertQueryData('search', secondSearch, searchResponse('old'))),
      store.dispatch(
        api.util.upsertQueryData('getSubscriptionDetail', detailArgs, {
          subscription: { subscriptionId: SUBSCRIPTION_ID, note: 'old' },
          pageInfo: {},
        }),
      ),
    ]);

    await store.dispatch(
      api.endpoints.updateSubscriptionNoteOptimistic.initiate({
        subscriptionId: SUBSCRIPTION_ID,
        note: 'new',
      }),
    );

    const state = store.getState();
    expect(getNotesFromSearchCache(state, firstSearch)).toEqual(['new', 'old']);
    expect(getNotesFromSearchCache(state, secondSearch)).toEqual(['new', 'old']);
    expect(api.endpoints.getSubscriptionDetail.select(detailArgs)(state).data.subscription.note).toBe('new');
  });
});
