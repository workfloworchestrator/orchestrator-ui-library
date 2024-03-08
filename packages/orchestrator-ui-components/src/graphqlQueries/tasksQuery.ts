import { parse } from 'graphql';
import { gql } from 'graphql-request';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {
    GraphqlQueryVariables,
    TaskDefinition,
    TaskDefinitionsResult,
} from '@/types';

export const GET_TASKS_GRAPHQL_QUERY: TypedDocumentNode<
    TaskDefinitionsResult,
    GraphqlQueryVariables<TaskDefinition>
> = parse(gql`
    query MetadataTasks(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $query: String
    ) {
        tasks(
            first: $first
            after: $after
            sortBy: $sortBy
            query: $query
            filterBy: { field: "target", value: "SYSTEM" }
        ) {
            page {
                name
                description
                target
                products {
                    tag
                }
                createdAt
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
