import {
  GraphqlSearchEdge,
  GraphqlSearchPayload,
  GraphqlSearchResponse,
  getCursorPaginationCacheOptions,
  getSearchVariables,
  toSelection,
} from '@/rtk/graphqlSearch';
import {
  BaseGraphQlResult,
  CACHETAG_TYPE_LIST,
  CacheTagType,
  GraphqlQueryVariables,
  Process,
  ProcessListResult,
  Subscription,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

import { orchestratorApi } from '../api';

export const processListQuery = `
    query ProcessList(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
        $query: String
    ) {
        processes(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
            query: $query
        ) {
            page {
                workflowName
                lastStep
                lastStatus
                workflowTarget
                product {
                    name
                    tag
                }
                customer {
                    fullname
                    shortcode
                }
                createdBy
                assignee
                processId
                startedAt
                lastModifiedAt
                isTask
                subscriptions {
                    page {
                        subscriptionId
                        description
                    }
                }
                note
                userPermissions {
                    retryAllowed
                    resumeAllowed
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
                endCursor
                sortFields
                filterFields
            }
        }
    }
`;

export type ProcessListResponse = {
  processes: Process[];
} & BaseGraphQlResult;

// Selected next to the requested columns: processId identifies the row, isTask and userPermissions
// drive the row actions, and subscriptions is not a search path (it is only requested when its column is visible)
const getProcessNodeSelection = (fields: string[], includeSubscriptions: boolean) =>
  [
    'processId',
    'isTask',
    'userPermissions { retryAllowed resumeAllowed }',
    ...(includeSubscriptions ? ['subscriptions { searchEdges { node { subscriptionId description } } }'] : []),
    ...fields.map(toSelection),
  ].join('\n');

export const getProcessListSearchQuery = (fields: string[], includeSubscriptions: boolean) =>
  `query ProcessListSearch(
        $first: Int!
        $after: Int!
        $search: ResourceSearchInput
    ) {
        processes(
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
                    ${getProcessNodeSelection(fields, includeSubscriptions)}
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

export type ProcessSubscriptions = {
  searchEdges: { node: Pick<Subscription, 'subscriptionId' | 'description'> }[];
};

// Only the selected columns are present in a hit
export type ProcessSearchNode = Pick<Process, 'processId' | 'isTask'>
  & Partial<Omit<Process, 'product' | 'customer' | 'subscriptions'>> & {
    subscriptions?: ProcessSubscriptions;
    product?: Partial<NonNullable<Process['product']>>;
    customer?: Partial<Process['customer']>;
  };

export type ProcessSearchEdge = GraphqlSearchEdge<ProcessSearchNode>;

export type ProcessListSearchResponse = GraphqlSearchResponse<ProcessSearchNode>;

export type ProcessListSearchPayload = GraphqlSearchPayload & { includeSubscriptions: boolean };

const processApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    getProcessList: build.query<ProcessListResponse, GraphqlQueryVariables<Process>>({
      query: (variables) => ({ document: processListQuery, variables }),
      transformResponse: (response: ProcessListResult): ProcessListResponse => {
        const processes = response.processes.page || [];

        return {
          processes,
          pageInfo: response.processes?.pageInfo || {},
        };
      },
      providesTags: getCacheTag(CacheTagType.processes, CACHETAG_TYPE_LIST),
    }),
    getProcessListSearch: build.query<ProcessListSearchResponse, ProcessListSearchPayload>({
      query: (payload) => ({
        document: getProcessListSearchQuery(payload.columns, payload.includeSubscriptions),
        variables: getSearchVariables(payload),
      }),
      transformResponse: ({ processes }: { processes: ProcessListSearchResponse }) => processes,
      ...getCursorPaginationCacheOptions<ProcessSearchNode>(({ processId }) => processId),
      providesTags: getCacheTag(CacheTagType.processes, CACHETAG_TYPE_LIST),
    }),
  }),
});

export const { useGetProcessListQuery, useLazyGetProcessListQuery, useGetProcessListSearchQuery } = processApi;
