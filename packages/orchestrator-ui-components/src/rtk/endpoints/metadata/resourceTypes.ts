import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    ProductBlockDefinition,
    ProductBlockDefinitionsResult,
    ResourceTypeDefinition,
    ResourceTypeDefinitionsResult,
} from '@/types';

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

const resourceTypesApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getResourceTypes: builder.query<
            ResourceTypesResponse,
            GraphqlQueryVariables<ResourceTypeDefinition>
        >({
            query: (variables) => ({
                document: resourceTypesQuery,
                variables,
            }),
            transformResponse: (
                response: ResourceTypeDefinitionsResult,
            ): ResourceTypesResponse => {
                const resourceTypes = response.resourceTypes.page || [];
                const pageInfo = response.resourceTypes.pageInfo || {};

                return {
                    resourceTypes,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetResourceTypesQuery, useLazyGetResourceTypesQuery } =
    resourceTypesApi;
