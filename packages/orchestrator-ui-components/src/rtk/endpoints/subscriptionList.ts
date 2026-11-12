import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import { orchestratorApi } from '@/rtk';
import {
  GraphqlSearchEdge,
  GraphqlSearchPayload,
  GraphqlSearchResponse,
  getSearchVariables,
  toSelection,
} from '@/rtk/graphqlSearch';
import {
  BaseGraphQlResult,
  CACHETAG_TYPE_LIST,
  CacheTagType,
  GraphqlQueryVariables,
  Subscription,
  SubscriptionsResult,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';
import { snakeToCamel } from '@/utils/strings';

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
  return fieldParts.map(snakeToCamel).join('.');
};

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

export type SubscriptionSearchEdge = GraphqlSearchEdge<SubscriptionSearchNode>;

export type SubscriptionListSearchResponse = GraphqlSearchResponse<SubscriptionSearchNode>;

type SubscriptionListSearchResult = {
  subscriptions: SubscriptionListSearchResponse;
};

export type SubscriptionListSearchPayload = GraphqlSearchPayload;

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
      providesTags: getCacheTag(CacheTagType.subscriptions, CACHETAG_TYPE_LIST),
    }),
  }),
});

export const { useGetSubscriptionListQuery, useLazyGetSubscriptionListQuery, useGetSubscriptionListSearchQuery } =
  subscriptionListApi;
