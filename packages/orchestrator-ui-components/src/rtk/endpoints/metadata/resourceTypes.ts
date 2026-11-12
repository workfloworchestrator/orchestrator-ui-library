import { METADATA_RESOURCE_TYPE_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
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
  CacheTagType,
  GraphqlQueryVariables,
  MetadataDescriptionParams,
  ResourceTypeDefinition,
  ResourceTypeDefinitionsResult,
} from '@/types';
import { getCacheTag } from '@/utils';

export const resourceTypesQuery = `
query MetadataResourceTypes(
    $first: Int!
    $after: Int!
    $sortBy: [GraphqlSort!]
    $query: String
) {
    resourceTypes(
        first: $first
        after: $after
        sortBy: $sortBy
        query: $query
    ) {
        page {
            resourceTypeId
            resourceType
            description
            productBlocks {
                description
                name
                productBlockId
                status
                createdAt
                endDate
            }
        }
        pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
            totalItems
            sortFields
            filterFields
        }
    }
}
`;

export type ResourceTypesResponse = {
  resourceTypes: ResourceTypeDefinition[];
} & BaseGraphQlResult;

// Selected next to the requested columns: resourceTypeId identifies the row and is needed to edit it.
// The nested list is no search path of its own: it is only requested when its column is visible.
const getResourceTypeNodeSelection = (fields: string[], includeProductBlocks: boolean) =>
  [
    'resourceTypeId',
    ...(includeProductBlocks ? ['productBlocks { name }'] : []),
    ...fields.filter((field) => field !== 'productBlocks').map(toSelection),
  ].join('\n');

export const getResourceTypeListSearchQuery = (fields: string[], includeProductBlocks: boolean) =>
  `query ResourceTypeListSearch(
        $first: Int!
        $after: Int!
        $search: ResourceSearchInput
    ) {
        resourceTypes(
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
                    ${getResourceTypeNodeSelection(fields, includeProductBlocks)}
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
export type ResourceTypeSearchNode = Pick<ResourceTypeDefinition, 'resourceTypeId'>
  & Partial<Omit<ResourceTypeDefinition, 'resourceTypeId'>>;

export type ResourceTypeSearchEdge = GraphqlSearchEdge<ResourceTypeSearchNode>;

export type ResourceTypeListSearchResponse = GraphqlSearchResponse<ResourceTypeSearchNode>;

export type ResourceTypeListSearchPayload = GraphqlSearchPayload & {
  includeProductBlocks: boolean;
};

const resourceTypesApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getResourceTypes: builder.query<ResourceTypesResponse, GraphqlQueryVariables<ResourceTypeDefinition>>({
      query: (variables) => ({
        document: resourceTypesQuery,
        variables,
      }),
      transformResponse: (response: ResourceTypeDefinitionsResult): ResourceTypesResponse => {
        const resourceTypes = response.resourceTypes.page || [];
        const pageInfo = response.resourceTypes.pageInfo || {};

        return {
          resourceTypes,
          pageInfo,
        };
      },
      providesTags: getCacheTag(CacheTagType.metadataResourceTypes),
    }),
    getResourceTypeListSearch: builder.query<ResourceTypeListSearchResponse, ResourceTypeListSearchPayload>({
      query: (payload) => ({
        document: getResourceTypeListSearchQuery(payload.columns, payload.includeProductBlocks),
        variables: getSearchVariables(payload),
      }),
      transformResponse: ({ resourceTypes }: { resourceTypes: ResourceTypeListSearchResponse }) => resourceTypes,
      ...getCursorPaginationCacheOptions<ResourceTypeSearchNode>(({ resourceTypeId }) => resourceTypeId),
      providesTags: getCacheTag(CacheTagType.metadataResourceTypes),
    }),
  }),
});

export const { useGetResourceTypesQuery, useLazyGetResourceTypesQuery, useGetResourceTypeListSearchQuery } =
  resourceTypesApi;

const resourceTypesRestApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    updateResourceType: build.mutation<null, MetadataDescriptionParams>({
      query: (resourceType) => ({
        url: `${METADATA_RESOURCE_TYPE_ENDPOINT}/${resourceType.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          description: resourceType.description,
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.metadataResourceTypes),
    }),
  }),
});

export const { useUpdateResourceTypeMutation } = resourceTypesRestApi;
