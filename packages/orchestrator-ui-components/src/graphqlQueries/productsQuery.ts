import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { parse } from 'graphql';
import { gql } from 'graphql-request';

import {
    GraphqlQueryVariables,
    ProductDefinition,
    ProductDefinitionsResult,
} from '../types';

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
                sortFields
                filterFields
            }
        }
    }
`);
