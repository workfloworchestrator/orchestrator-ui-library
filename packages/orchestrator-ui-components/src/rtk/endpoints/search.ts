import { getEndpointPath } from '@/components/WfoSearchPage/utils';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
  EntityKind,
  Filter,
  GraphQLSort,
  PaginatedSearchResults,
  PathAutocompleteResponse,
  RetrieverType,
  SearchResult,
  value_schema,
} from '@/types';

export interface SearchPayload {
  entity_type: EntityKind;
  query: string;
  filters?: Filter;
  limit?: number;
  cursor?: number;
  retriever?: RetrieverType;
  response_columns?: string[];
  sort_by: GraphQLSort<SearchResultResponse>;
}

export interface SearchPaginationPayload extends SearchPayload {
  cursor: number;
}

export interface SearchDefinitionsResponse {
  [key: string]: {
    operators: string[];
    value_schema: Record<string, value_schema>;
  };
}

export type SearchResultResponse = {
  subscriptionId: string;
  description: string;
  status: string;
  insync: string;
  productName: string;
  tag: string;
  customerFullname: string;
  customerShortcode: string;
  startDate: string;
  endDate: string;
  note: string;
} & SearchResult;

export type PaginatedSearchResultsResponse = {
  data: SearchResultResponse[];
} & PaginatedSearchResults;

export const response_column_by_table_column = {
  subscriptionId: 'subscription.subscription_id',
  description: 'subscription.description',
  status: 'subscription.status',
  insync: 'subscription.insync',
  productName: 'subscription.product.name',
  tag: 'subscription.product.tag',
  customerFullname: 'subscription.customer_name',
  customerShortcode: 'subscription.customer_abbreviation',
  startDate: 'subscription.start_date',
  endDate: 'subscription.end_date',
  note: 'subscription.note',
};
export const subscription_response_columns = Object.values(response_column_by_table_column);

const searchApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    search: build.mutation<PaginatedSearchResultsResponse, SearchPayload>({
      query: ({ entity_type, query, filters, limit, retriever, response_columns, sort_by }) => ({
        url: `search/${getEndpointPath(entity_type)}`,
        method: 'POST',
        body: {
          query,
          filters,
          limit,
          retriever,
          response_columns,
          order_by:
            query ? undefined : (
              {
                field: sort_by.field,
                element: response_column_by_table_column[sort_by.field],
                direction: sort_by.order.toLowerCase(),
              }
            ),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: PaginatedSearchResults): PaginatedSearchResultsResponse => {
        return {
          ...response,
          data: response.data.map((v) =>
            v.response_columns ?
              {
                ...v,
                ...Object.fromEntries(
                  Object.entries(response_column_by_table_column)
                    .filter(([, responseCol]) => responseCol in v.response_columns)
                    .map(([tableCol, responseCol]) => [tableCol, v.response_columns[responseCol]]),
                ),
              }
            : v,
          ),
        };
      },
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

export const { useSearchMutation, useSearchWithPaginationMutation, useSearchPathsQuery, useSearchDefinitionsQuery } =
  searchApi;
