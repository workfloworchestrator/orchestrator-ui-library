import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { FetchArgs } from '@reduxjs/toolkit/query';

import { orchestratorApi } from '@/rtk/api';
import { EntityKind, PaginatedSearchResults, RetrieverType } from '@/types';

// Importing the endpoint module injects it into orchestratorApi
import './search';

const exportResponse: PaginatedSearchResults = {
  data: [],
  cursor: null,
  page_info: { has_next_page: false, next_page_cursor: null },
  search_metadata: { search_type: null, description: null },
};

// jsdom has no fetch, so the request RTK Query builds is captured from fetchBaseQuery instead
const fetchMock = jest.fn();
jest.mock('@reduxjs/toolkit/query/react', () => {
  const actual = jest.requireActual('@reduxjs/toolkit/query/react');
  return {
    ...actual,
    fetchBaseQuery:
      ({ baseUrl }: { baseUrl: string }) =>
      async (args: FetchArgs) => {
        fetchMock({ ...args, url: `${baseUrl}/${args.url}` });
        return { data: exportResponse };
      },
  };
});

// The injected endpoints are not part of orchestratorApi's static type, hence the cast below
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = orchestratorApi as any;

const createStore = () =>
  configureStore({
    reducer: combineReducers({
      [orchestratorApi.reducerPath]: orchestratorApi.reducer,
      orchestratorConfig: () => ({ orchestratorApiBaseUrl: 'http://api', authActive: false }),
    }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(orchestratorApi.middleware),
  });

const basePayload = {
  query: '',
  entity_type: EntityKind.SUBSCRIPTION,
  response_columns: ['subscription.subscription_id', 'subscription.status'],
  filters: { op: 'AND', children: [] },
  order_by: { element: 'subscription.start_date', direction: 'desc' },
};

describe('searchExport', () => {
  beforeEach(() => fetchMock.mockClear());

  const sendExport = async (payload: object) => {
    const store = createStore();
    const result = await store.dispatch(api.endpoints.searchExport.initiate(payload));
    const request: FetchArgs = fetchMock.mock.calls[0][0];
    return { result, request, store };
  };

  it.each([
    [EntityKind.SUBSCRIPTION, 'subscriptions'],
    [EntityKind.PRODUCT, 'products'],
    [EntityKind.WORKFLOW, 'workflows'],
    [EntityKind.PROCESS, 'processes'],
  ])('posts %s exports to the export endpoint', async (entityType, path) => {
    const { request } = await sendExport({ ...basePayload, entity_type: entityType });

    expect(request.method).toBe('POST');
    expect(request.url).toBe(`http://api/search/${path}/export`);
  });

  it('sends the filters, ordering and response columns in the body', async () => {
    const { request, result } = await sendExport(basePayload);

    expect(request.body).toEqual({
      query: '',
      filters: basePayload.filters,
      retriever: undefined,
      order_by: basePayload.order_by,
      response_columns: basePayload.response_columns,
    });
    expect(result.data).toEqual(exportResponse);
  });

  it('drops order_by when there is a text query and forwards the retriever', async () => {
    const { request } = await sendExport({ ...basePayload, query: 'fiber', retriever: RetrieverType.Fuzzy });

    expect(request.body).toMatchObject({ query: 'fiber', retriever: RetrieverType.Fuzzy, order_by: undefined });
  });

  it('never sends a pagination cursor or limit, so the backend applies its export limit', async () => {
    const { request } = await sendExport({ ...basePayload, cursor: 'abc', limit: 25 });

    expect(request.url).not.toContain('cursor');
    expect(request.body).not.toHaveProperty('cursor');
    expect(request.body).not.toHaveProperty('limit');
  });

  it('does not touch the cached search results', async () => {
    const { store } = await sendExport(basePayload);

    expect(api.endpoints.search.select({ ...basePayload })(store.getState()).data).toBeUndefined();
  });
});
