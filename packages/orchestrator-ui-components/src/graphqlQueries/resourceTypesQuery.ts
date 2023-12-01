import { parse } from 'graphql';
import { gql } from 'graphql-request';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import type {
    GraphqlQueryVariables,
    ResourceTypeDefinition,
    ResourceTypeDefinitionsResult,
} from '@/types';

export const GET_RESOURCE_TYPES_GRAPHQL_QUERY: TypedDocumentNode<
    ResourceTypeDefinitionsResult,
    GraphqlQueryVariables<ResourceTypeDefinition>
> = parse(gql`
    query MetadataResourceTypes(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
    ) {
        resourceTypes(
            first: $first
            after: $after
            sortBy: $sortBy # query: $query
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
`);
