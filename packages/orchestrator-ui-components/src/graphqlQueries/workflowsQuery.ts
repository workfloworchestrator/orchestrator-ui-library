import { parse } from 'graphql';
import { gql } from 'graphql-request';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {
    GraphqlQueryVariables,
    WorkflowDefinition,
    WorkflowDefinitionsResult,
} from '@/types';

// TODO: fix filterBy to include CREATE, MODIFY, TERMINATE
export const GET_WORKFLOWS_GRAPHQL_QUERY: TypedDocumentNode<
    WorkflowDefinitionsResult,
    GraphqlQueryVariables<WorkflowDefinition>
> = parse(gql`
    query MetadataWorkflows(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $query: String
    ) {
        workflows(
            first: $first
            after: $after
            sortBy: $sortBy
            query: $query
            filterBy: { field: "target", value: "CREATE" }
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
