import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { SortOrder } from '../types';

import type { ProductBlockDefinition } from '../types';
import { GraphqlQueryVariables, GraphQLResult } from '../types';

export const DEFAULT_SORT_FIELD: keyof ProductBlockDefinition = 'name';
export const DEFAULT_SORT_ORDER: SortOrder = SortOrder.DESC;

export const GET_PRODUCTS_BLOCKS_GRAPHQL_QUERY: TypedDocumentNode<
    GraphQLResult<ProductBlockDefinition>,
    GraphqlQueryVariables<ProductBlockDefinition>
> = parse(gql`
    query MetadataProductBlocks(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
    ) {
        results(first: $first, after: $after, sortBy: $sortBy) {
            page {
                name
                description
                tag
                createdAt
                productType
                status
                productBlocks {
                    name
                }
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
