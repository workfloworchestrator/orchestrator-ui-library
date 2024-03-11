import { orchestratorApi } from '@/rtk';
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
