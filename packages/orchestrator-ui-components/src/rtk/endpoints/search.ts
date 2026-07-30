import { getEndpointPath } from '@/components/WfoSearchPage/utils';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
  EntityKind,
  Filter,
  PaginatedSearchResults,
  PathAutocompleteResponse,
  RetrieverType,
  value_schema,
} from '@/types';

export interface SearchPayload {
  order_by?: {
    element: string;
    direction: string;
  };
  response_columns: string[];
  entity_type: EntityKind;
  query: string;
  filters?: Filter;
  limit?: number | number[];
  retriever?: RetrieverType;
  cursor?: string;
}

export interface SearchPaginationPayload extends Omit<SearchPayload, 'cursor'> {
  cursor: number;
}

export interface SearchDefinitionsResponse {
  [key: string]: {
    operators: string[];
    value_schema: Record<string, value_schema>;
  };
}

const searchApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<PaginatedSearchResults, SearchPayload>({
      query: ({ entity_type, query, filters, limit, retriever, response_columns, order_by, cursor }) => ({
        url: `search/${getEndpointPath(entity_type)}${cursor ? `?cursor=${cursor}` : ''}`,
        method: 'POST',
        body: {
          query,
          filters,
          limit: cursor ? undefined : limit,
          retriever,
          order_by: order_by && !query ? order_by : undefined,
          response_columns,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        // Strip cursor so every page of the same base search shares one cache entry.
        const rest = { ...queryArgs };
        delete rest.cursor;
        return { endpointName, queryArgs: rest };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.cursor) {
          Object.assign(currentCache, newItems);
          return;
        }
        currentCache.data.push(...newItems.data);
        currentCache.page_info = newItems.page_info;
        currentCache.cursor = newItems.cursor;
        currentCache.search_metadata = newItems.search_metadata;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
    searchWithPagination: build.mutation<PaginatedSearchResults, SearchPaginationPayload>({
      query: ({ cursor, entity_type, query, filters, limit, retriever }) => ({
        url: `search/${getEndpointPath(entity_type)}?cursor=${cursor}`,
        method: 'POST',
        body: { query, filters, limit, retriever },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
    searchPaths: build.query<PathAutocompleteResponse, { q: string; entity_type: EntityKind }>({
      query: ({ q, entity_type }) => ({
        url: `search/paths?q=${encodeURIComponent(q)}&entity_type=${entity_type}`,
        method: 'GET',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
    searchDefinitions: build.query<SearchDefinitionsResponse, void>({
      query: () => ({
        url: 'search/definitions',
        method: 'GET',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const {
  useSearchQuery,
  useLazySearchQuery,
  useSearchWithPaginationMutation,
  useSearchPathsQuery,
  useLazySearchPathsQuery,
  useSearchDefinitionsQuery,
} = searchApi;
