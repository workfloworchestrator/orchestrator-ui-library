import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import { orchestratorApi } from '@/rtk';
import type { SearchPayload } from '@/rtk/endpoints/search';
import {
  BaseGraphQlResult,
  CacheTagType,
  GraphQLPageInfo,
  GraphqlQueryVariables,
  MatchingField,
  Subscription,
  SubscriptionsResult,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

export const subscriptionListQuery = `query SubscriptionsList(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
        $query: String
    ) {
        subscriptions(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
            query: $query
        ) {
            page {
                note
                startDate
                endDate
                description
                insync
                status
                subscriptionId
                product {
                    name
                    tag
                    productType
                }
                customer {
                    customerId
                    fullname
                    shortcode
                }
                metadata
            }
            pageInfo {
                totalItems
                startCursor
                hasPreviousPage
                hasNextPage
                endCursor
                sortFields
                filterFields
            }
        }
    }
`;

export type SubscriptionListResponse = {
  subscriptions: Subscription[];
} & BaseGraphQlResult;

// Search paths whose GraphQL field is not the camelCased search path
const GRAPHQL_FIELD_OVERRIDES: Record<string, string> = {
  'subscription.customer_name': 'customer.fullname',
  'subscription.customer_abbreviation': 'customer.shortcode',
};

// 'subscription.product.name' -> 'product.name', 'subscription.start_date' -> 'startDate'
export const getGraphqlField = (searchPath: string): string => {
  const override = GRAPHQL_FIELD_OVERRIDES[searchPath];
  if (override) {
    return override;
  }

  // The first part is the entity ('subscription'), which the node selection is already scoped to
  const [, ...fieldParts] = searchPath.split('.');
  const camelCasedParts = fieldParts.map((part) =>
    part.replace(/_(\w)/g, (_, character: string) => character.toUpperCase()),
  );

  return camelCasedParts.join('.');
};

// 'product.name' -> 'product { name }'
const toSelection = (path: string) =>
  path.split('.').reduceRight((inner, field) => (inner ? `${field} { ${inner} }` : field), '');

// Builds the node selection from the search paths of the requested columns (e.g. 'product.name'), so only the requested
// columns are fetched. Paths sharing a parent are left as separate selections, which GraphQL merges.
// subscriptionId is always selected: it identifies the row.
export const getSubscriptionNodeSelection = (searchPaths: string[]) =>
  ['subscriptionId', ...searchPaths.map(getGraphqlField)].map(toSelection).join('\n');

export const getSubscriptionListSearchQuery = (searchPaths: string[]) => `query SubscriptionsListSearch(
        $first: Int!
        $after: Int!
        $search: ResourceSearchInput
    ) {
        subscriptions(
            first: $first
            after: $after
            search: $search
        ) {
            searchEdges {
                score
                matchingFields {
                    text
                    path
                    highlightIndices
                }
                node {
                    ${getSubscriptionNodeSelection(searchPaths)}
                }
            }
            pageInfo {
                totalItems
                hasNextPage
            }
            nextPageCursor
        }
    }
`;

// Only the selected columns are present in a hit
export type SubscriptionSearchNode = Pick<Subscription, 'subscriptionId'>
  & Partial<Omit<Subscription, 'productBlockInstances' | 'subscriptionId' | 'product' | 'customer'>> & {
    product?: Partial<Subscription['product']>;
    customer?: Partial<Subscription['customer']>;
  };

export type SubscriptionSearchEdge = {
  score: number;
  matchingFields: MatchingField[];
  node: SubscriptionSearchNode;
};

export type SubscriptionListSearchResponse = {
  searchEdges: SubscriptionSearchEdge[];
  pageInfo: Pick<GraphQLPageInfo, 'totalItems' | 'hasNextPage'>;
  nextPageCursor: string | null;
};

type SubscriptionListSearchResult = {
  subscriptions: SubscriptionListSearchResponse;
};

export type SubscriptionListSearchPayload = Omit<SearchPayload, 'entity_type' | 'response_columns'> & {
  columns: string[];
};

const getSearchVariables = ({ query, filters, limit, retriever, order_by, cursor }: SubscriptionListSearchPayload) => ({
  first: Array.isArray(limit) ? limit[0] : (limit ?? 10),
  after: 0,
  search: {
    query: query || undefined,
    elasticFilters: filters,
    retriever: retriever && retriever !== 'auto' ? retriever.toUpperCase() : undefined,
    // Same as the REST endpoint: ordering only applies to a structured search, not to a text query
    orderBy:
      order_by && !query ? { element: order_by.element, direction: order_by.direction.toUpperCase() } : undefined,
    cursor,
  },
});

const subscriptionListApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionList: builder.query<SubscriptionListResponse, GraphqlQueryVariables<SubscriptionListItem>>({
      query: (variables) => ({
        document: subscriptionListQuery,
        variables,
      }),
      transformResponse: (response: SubscriptionsResult): SubscriptionListResponse => {
        const subscriptions = response.subscriptions.page || [];
        const pageInfo = response.subscriptions.pageInfo || {};

        return {
          subscriptions,
          pageInfo,
        };
      },
      providesTags: getCacheTag(CacheTagType.subscriptions),
    }),
    getSubscriptionListSearch: builder.query<SubscriptionListSearchResponse, SubscriptionListSearchPayload>({
      query: (payload) => ({
        document: getSubscriptionListSearchQuery(payload.columns),
        variables: getSearchVariables(payload),
      }),
      transformResponse: ({ subscriptions }: SubscriptionListSearchResult): SubscriptionListSearchResponse =>
        subscriptions,
      // Strip cursor so every page of the same base search shares one cache entry.
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const rest = { ...queryArgs };
        delete rest.cursor;
        return { endpointName, queryArgs: rest };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.cursor) {
          Object.assign(currentCache, newItems);
          return;
        }
        currentCache.searchEdges.push(...newItems.searchEdges);
        currentCache.pageInfo = newItems.pageInfo;
        currentCache.nextPageCursor = newItems.nextPageCursor;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      providesTags: getCacheTag(CacheTagType.subscriptions),
    }),
  }),
});

export const { useGetSubscriptionListQuery, useLazyGetSubscriptionListQuery, useGetSubscriptionListSearchQuery } =
  subscriptionListApi;
