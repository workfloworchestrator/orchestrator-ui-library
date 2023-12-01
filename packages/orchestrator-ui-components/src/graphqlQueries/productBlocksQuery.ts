import { parse } from 'graphql';
import { gql } from 'graphql-request';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import type { ProductBlockDefinition } from '@/types';
import { GraphqlQueryVariables, ProductBlockDefinitionsResult } from '@/types';

export const GET_PRODUCTS_BLOCKS_GRAPHQL_QUERY: TypedDocumentNode<
    ProductBlockDefinitionsResult,
    GraphqlQueryVariables<ProductBlockDefinition>
> = parse(gql`
    query MetadataProductBlocks(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!] # $query: String
    ) {
        productBlocks(
            first: $first
            after: $after
            sortBy: $sortBy # query: $query
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
`);
