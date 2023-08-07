import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import type {
    ProductDefinition,
    GraphqlQueryVariables,
    ProductDefinitionsResult,
} from '@orchestrator-ui/orchestrator-ui-components';

export const GET_PRODUCTS_GRAPHQL_QUERY: TypedDocumentNode<
    ProductDefinitionsResult,
    GraphqlQueryVariables<ProductDefinition>
> = parse(gql`
    query MetadataProducts(
        $first: IntType!
        $after: IntType!
        $sortBy: [GraphqlSort!]
    ) {
        products(first: $first, after: $after, sortBy: $sortBy) {
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
            }
        }
    }
`);
