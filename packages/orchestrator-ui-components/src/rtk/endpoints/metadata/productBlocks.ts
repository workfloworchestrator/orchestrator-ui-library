import { METADATA_PRODUCT_BLOCK_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { MetadataDescriptionParams } from '@/types';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    ProductBlockDefinition,
    ProductBlockDefinitionsResult,
} from '@/types';

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

const productBlocksApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getProductBlocks: builder.query<
            ProductBlocksResponse,
            GraphqlQueryVariables<ProductBlockDefinition>
        >({
            query: (variables) => ({
                document: productBlocksQuery,
                variables,
            }),
            transformResponse: (
                response: ProductBlockDefinitionsResult,
            ): ProductBlocksResponse => {
                const productBlocks = response.productBlocks.page || [];
                const pageInfo = response.productBlocks.pageInfo || {};

                return {
                    productBlocks,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetProductBlocksQuery, useLazyGetProductBlocksQuery } =
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
        }),
    }),
});

export const { useUpdateProductBlockMutation } = productBlocksRestApi;
