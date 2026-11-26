import { METADATA_RESOURCE_TYPE_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { GraphqlSearchPayload, GraphqlSearchResponse, getSearchVariables } from '@/rtk/graphqlSearch';
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

// All columns are always requested, so hiding and showing a column never leaves rows without its data
export const resourceTypeListSearchQuery = `query ResourceTypeListSearch(
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
                    resourceTypeId
                    resourceType
                    description
                    productBlocks { name }
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

export type ResourceTypeListSearchResponse = GraphqlSearchResponse<ResourceTypeDefinition>;

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
    getResourceTypeListSearch: builder.query<ResourceTypeListSearchResponse, GraphqlSearchPayload>({
      query: (payload) => ({
        document: resourceTypeListSearchQuery,
        variables: getSearchVariables(payload),
      }),
      transformResponse: ({ resourceTypes }: { resourceTypes: ResourceTypeListSearchResponse }) => resourceTypes,
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
