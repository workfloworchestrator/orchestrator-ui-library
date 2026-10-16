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
    await createStore().dispatch(api.endpoints.searchExport.initiate(payload));
    return fetchMock.mock.calls[0][0] as FetchArgs;
  };

  it('posts the search body without a limit or cursor to the export endpoint', async () => {
    // The subscriptions page passes its page-sized limit and current cursor along with the search payload
    const request = await sendExport({ ...basePayload, limit: 30, cursor: 'next-page-cursor' });

    expect(request.method).toBe('POST');
    expect(request.url).toBe('http://api/search/subscriptions/export');
    expect(request.body).toEqual({
      query: '',
      filters: basePayload.filters,
      retriever: undefined,
      order_by: basePayload.order_by,
      response_columns: basePayload.response_columns,
    });
    expect(request.body).not.toHaveProperty('limit');
    expect(request.body).not.toHaveProperty('cursor');
  });

  it('drops order_by when there is a text query', async () => {
    const request = await sendExport({ ...basePayload, query: 'fiber', retriever: RetrieverType.Fuzzy });

    expect(request.body).toMatchObject({ query: 'fiber', retriever: RetrieverType.Fuzzy, order_by: undefined });
  });
});
