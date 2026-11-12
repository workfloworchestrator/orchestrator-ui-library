import { METADATA_PRODUCT_BLOCK_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
  GraphqlSearchEdge,
  GraphqlSearchPayload,
  GraphqlSearchResponse,
  getCursorPaginationCacheOptions,
  getSearchVariables,
  toSelection,
} from '@/rtk/graphqlSearch';
import { MetadataDescriptionParams } from '@/types';
import {
  BaseGraphQlResult,
  CacheTagType,
  GraphqlQueryVariables,
  ProductBlockDefinition,
  ProductBlockDefinitionsResult,
} from '@/types';
import { getCacheTag, getProductLifecycleStatus } from '@/utils';

export const productBlocksQuery = `
    query MetadataProductBlocks(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $query: String
    ) {
        productBlocks(
            first: $first
            after: $after
            sortBy: $sortBy
            query: $query
        ) {
            page {
                productBlockId
                name
                tag
                description
                status
                createdAt
                endDate
                resourceTypes {
                    description
                    resourceType
                    resourceTypeId
                }
                dependsOn {
                    productBlockId
                    name
                    tag
                    description
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

export type ProductBlocksResponse = {
  productBlocks: ProductBlockDefinition[];
} & BaseGraphQlResult;

const NESTED_LIST_FIELDS = ['resourceTypes', 'dependsOn'];

// Selected next to the requested columns: productBlockId identifies the row and is needed to edit it.
// The nested lists are no search path of their own: they are only requested when their column is visible.
const getProductBlockNodeSelection = (fields: string[], includeResourceTypes: boolean, includeDependsOn: boolean) =>
  [
    'productBlockId',
    ...(includeResourceTypes ? ['resourceTypes { resourceType description resourceTypeId }'] : []),
    ...(includeDependsOn ? ['dependsOn { name }'] : []),
    ...fields.filter((field) => !NESTED_LIST_FIELDS.includes(field)).map(toSelection),
  ].join('\n');

export const getProductBlockListSearchQuery = (
  fields: string[],
  includeResourceTypes: boolean,
  includeDependsOn: boolean,
) =>
  `query ProductBlockListSearch(
        $first: Int!
        $after: Int!
        $search: ResourceSearchInput
    ) {
        productBlocks(
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
                    ${getProductBlockNodeSelection(fields, includeResourceTypes, includeDependsOn)}
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
export type ProductBlockSearchNode = Pick<ProductBlockDefinition, 'productBlockId'>
  & Partial<Omit<ProductBlockDefinition, 'productBlockId'>>;

export type ProductBlockSearchEdge = GraphqlSearchEdge<ProductBlockSearchNode>;

export type ProductBlockListSearchResponse = GraphqlSearchResponse<ProductBlockSearchNode>;

export type ProductBlockListSearchPayload = GraphqlSearchPayload & {
  includeResourceTypes: boolean;
  includeDependsOn: boolean;
};

const productBlocksApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductBlocks: builder.query<ProductBlocksResponse, GraphqlQueryVariables<ProductBlockDefinition>>({
      query: (variables) => ({
        document: productBlocksQuery,
        variables,
      }),
      transformResponse: (response: ProductBlockDefinitionsResult): ProductBlocksResponse => {
        const productBlocks = (response.productBlocks.page || []).map((productBlock) => ({
          ...productBlock,
          status: getProductLifecycleStatus(productBlock.status),
          dependsOn: productBlock.dependsOn.map((dependsOnBlock) => ({
            ...dependsOnBlock,
            status: getProductLifecycleStatus(dependsOnBlock.status),
          })),
        }));
        const pageInfo = response.productBlocks.pageInfo || {};

        return {
          productBlocks,
          pageInfo,
        };
      },
      providesTags: getCacheTag(CacheTagType.metadataProductBlocks),
    }),
    getProductBlockListSearch: builder.query<ProductBlockListSearchResponse, ProductBlockListSearchPayload>({
      query: (payload) => ({
        document: getProductBlockListSearchQuery(
          payload.columns,
          payload.includeResourceTypes,
          payload.includeDependsOn,
        ),
        variables: getSearchVariables(payload),
      }),
      transformResponse: ({ productBlocks }: { productBlocks: ProductBlockListSearchResponse }) => productBlocks,
      ...getCursorPaginationCacheOptions<ProductBlockSearchNode>(({ productBlockId }) => productBlockId),
      providesTags: getCacheTag(CacheTagType.metadataProductBlocks),
    }),
  }),
});

export const { useGetProductBlocksQuery, useLazyGetProductBlocksQuery, useGetProductBlockListSearchQuery } =
  productBlocksApi;

const productBlocksRestApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    updateProductBlock: build.mutation<null, MetadataDescriptionParams>({
      query: (productBlock) => ({
        url: `${METADATA_PRODUCT_BLOCK_ENDPOINT}/${productBlock.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          description: productBlock.description,
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.metadataProductBlocks),
    }),
  }),
});

export const { useUpdateProductBlockMutation } = productBlocksRestApi;
