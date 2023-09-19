import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
    GraphqlQueryVariables,
    WorkflowDefinition,
    WorkflowDefinitionsResult,
} from '../../types';

export const GET_WORKFLOWS_GRAPHQL_QUERY: TypedDocumentNode<
    WorkflowDefinitionsResult,
    GraphqlQueryVariables<WorkflowDefinition>
> = parse(gql`
    query MetadataWorkflows(
        $first: IntType!
        $after: IntType!
        $sortBy: [GraphqlSort!]
    ) {
        workflows(first: $first, after: $after, sortBy: $sortBy) {
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
            }
        }
    }
`);
