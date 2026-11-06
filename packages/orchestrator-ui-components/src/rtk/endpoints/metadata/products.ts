import { METADATA_PRODUCT_ENDPOINT } from '@/configuration/constants';
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
  MetadataStatusParams,
  ProductDefinition,
  ProductDefinitionsResult,
} from '@/types';
import { getCacheTag, getProductLifecycleStatus } from '@/utils';

export const products = `
    query MetadataProducts(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $query: String
    ) {
        products(first: $first, after: $after, sortBy: $sortBy, query: $query) {
            page {
                productId
                name
                description
                tag
                createdAt
                productType
                status
                productBlocks {
                    name
                }
                fixedInputs {
                    name
                    value
                }
                endDate
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

export type ProductsResponse = {
  products: ProductDefinition[];
} & BaseGraphQlResult;

// Selected next to the requested columns: productId identifies the row and is needed to edit it.
// The nested lists are no search path of their own: they are only requested when their column is visible.
const getProductNodeSelection = (fields: string[], includeProductBlocks: boolean, includeFixedInputs: boolean) =>
  [
    'productId',
    ...(includeProductBlocks ? ['productBlocks { name }'] : []),
    ...(includeFixedInputs ? ['fixedInputs { name value }'] : []),
    ...fields.filter((field) => !['productBlocks', 'fixedInputs'].includes(field)).map(toSelection),
  ].join('\n');

export const getProductListSearchQuery = (
  fields: string[],
  includeProductBlocks: boolean,
  includeFixedInputs: boolean,
) =>
  `query ProductListSearch(
        $first: Int!
        $after: Int!
        $search: ResourceSearchInput
    ) {
        products(
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
                    ${getProductNodeSelection(fields, includeProductBlocks, includeFixedInputs)}
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
export type ProductSearchNode = Pick<ProductDefinition, 'productId'> & Partial<Omit<ProductDefinition, 'productId'>>;

export type ProductSearchEdge = GraphqlSearchEdge<ProductSearchNode>;

export type ProductListSearchResponse = GraphqlSearchResponse<ProductSearchNode>;

export type ProductListSearchPayload = GraphqlSearchPayload & {
  includeProductBlocks: boolean;
  includeFixedInputs: boolean;
};

const productsApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GraphqlQueryVariables<ProductDefinition>>({
      query: (variables) => ({
        document: products,
        variables,
      }),
      transformResponse: (response: ProductDefinitionsResult): ProductsResponse => {
        const products = (response.products.page || []).map((product) => ({
          ...product,
          status: getProductLifecycleStatus(product.status),
        }));
        const pageInfo = response.products.pageInfo || {};

        return {
          products,
          pageInfo,
        };
      },
      providesTags: getCacheTag(CacheTagType.metadataProducts),
    }),
    getProductListSearch: builder.query<ProductListSearchResponse, ProductListSearchPayload>({
      query: (payload) => ({
        document: getProductListSearchQuery(payload.columns, payload.includeProductBlocks, payload.includeFixedInputs),
        variables: getSearchVariables(payload),
      }),
      transformResponse: ({ products }: { products: ProductListSearchResponse }) => products,
      ...getCursorPaginationCacheOptions<ProductSearchNode>(({ productId }) => productId),
      providesTags: getCacheTag(CacheTagType.metadataProducts),
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery, useGetProductListSearchQuery } = productsApi;

const productRestApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    updateProductDescription: build.mutation<null, MetadataDescriptionParams>({
      query: (product) => ({
        url: `${METADATA_PRODUCT_ENDPOINT}/${product.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          description: product.description,
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.metadataProducts),
    }),
    updateProductStatus: build.mutation<null, MetadataStatusParams>({
      query: (product) => ({
        url: `${METADATA_PRODUCT_ENDPOINT}/${product.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          status: product.status,
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.metadataProducts),
    }),
  }),
});

export const { useUpdateProductDescriptionMutation, useUpdateProductStatusMutation } = productRestApi;
