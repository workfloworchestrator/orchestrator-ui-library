import { METADATA_PRODUCT_ENDPOINT } from '@/configuration/constants';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    MetadataDescriptionParams,
    ProductDefinition,
    ProductDefinitionsResult,
} from '@/types';

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

const productsApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<
            ProductsResponse,
            GraphqlQueryVariables<ProductDefinition>
        >({
            query: (variables) => ({
                document: products,
                variables,
            }),
            transformResponse: (
                response: ProductDefinitionsResult,
            ): ProductsResponse => {
                const products = response.products.page || [];
                const pageInfo = response.products.pageInfo || {};

                return {
                    products,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery } = productsApi;

const productRestApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        updateProduct: build.mutation<null, MetadataDescriptionParams>({
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
        }),
    }),
});

export const { useUpdateProductMutation } = productRestApi;
