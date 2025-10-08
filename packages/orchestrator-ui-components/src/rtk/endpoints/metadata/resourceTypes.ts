import { METADATA_RESOURCE_TYPE_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    MetadataDescriptionParams,
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
        }),
    }),
});

export const { useUpdateResourceTypeMutation } = resourceTypesRestApi;
