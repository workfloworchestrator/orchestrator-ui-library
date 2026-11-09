import { getEndpointPath } from '@/components/WfoSearchPage/utils';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
  CacheTagType,
  EntityKind,
  Filter,
  PaginatedSearchResults,
  PathAutocompleteResponse,
  RetrieverType,
  SearchResult,
  value_schema,
} from '@/types';
import { getCacheTag } from '@/utils';

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

// The export endpoint defaults the limit to SEARCH_MAX_EXPORT_LIMIT, so no limit is sent
export type SearchExportPayload = Omit<SearchPayload, 'cursor' | 'limit'>;

export interface SearchPaginationPayload extends Omit<SearchPayload, 'cursor'> {
  cursor: number;
}

export interface SearchDefinitionsResponse {
  [key: string]: {
    operators: string[];
    value_schema: Record<string, value_schema>;
  };
}

type RestMatchingField = { text: string; path: string; highlight_indices: [number, number][] };
type RestSearchResult = Omit<SearchResult, 'matchingFields'> & { matching_fields?: RestMatchingField[] | null };
type RestPaginatedSearchResults = Omit<PaginatedSearchResults, 'data'> & { data: RestSearchResult[] };

// The REST search API responds in snake_case, the UI uses camelCase for matching fields
const mapSearchResults = ({ data, ...rest }: RestPaginatedSearchResults): PaginatedSearchResults => ({
  ...rest,
  data: data.map(({ matching_fields, ...result }) => ({
    ...result,
    matchingFields: matching_fields?.map(({ highlight_indices, ...field }) => ({
      ...field,
      highlightIndices: highlight_indices,
    })),
  })),
});

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
      transformResponse: mapSearchResults,
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
      providesTags: getCacheTag(CacheTagType.subscriptions),
    }),
    // Exports run as a mutation so the (large) result never lands in, or overwrites, the cached table results
    searchExport: build.mutation<PaginatedSearchResults, SearchExportPayload>({
      query: ({ entity_type, query, filters, retriever, response_columns, order_by }) => ({
        url: `search/${getEndpointPath(entity_type)}/export`,
        method: 'POST',
        body: {
          query,
          filters,
          retriever,
          order_by: order_by && !query ? order_by : undefined,
          response_columns,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: mapSearchResults,
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
      transformResponse: mapSearchResults,
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
  useSearchExportMutation,
  useSearchWithPaginationMutation,
  useSearchPathsQuery,
  useLazySearchPathsQuery,
  useSearchDefinitionsQuery,
} = searchApi;
