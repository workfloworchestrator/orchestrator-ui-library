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

// Builds the node selection from the GraphQL fields of the requested columns (e.g. 'product.name'), so only the requested
// columns are fetched. Paths sharing a parent are left as separate selections, which GraphQL merges.
// subscriptionId is always selected: it identifies the row.
export const getSubscriptionNodeSelection = (fields: string[]) =>
  ['subscriptionId', ...fields].map(toSelection).join('\n');

export const getSubscriptionListSearchQuery = (fields: string[]) =>
  `query SubscriptionsListSearch(
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
                    ${getSubscriptionNodeSelection(fields)}
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
      providesTags: getCacheTag(CacheTagType.subscriptions, CACHETAG_TYPE_LIST),
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
