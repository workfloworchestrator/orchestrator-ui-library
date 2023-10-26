import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import type {
    ResourceTypeDefinition,
    ResourceTypeDefinitionsResult,
    GraphqlQueryVariables,
} from '../types';

export const GET_RESOURCE_TYPES_GRAPHQL_QUERY: TypedDocumentNode<
    ResourceTypeDefinitionsResult,
    GraphqlQueryVariables<ResourceTypeDefinition>
> = parse(gql`
    query MetadataResourceTypes(
        $first: IntType!
        $after: IntType!
        $sortBy: [GraphqlSort!]
    ) {
        resourceTypes(first: $first, after: $after, sortBy: $sortBy) {
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
