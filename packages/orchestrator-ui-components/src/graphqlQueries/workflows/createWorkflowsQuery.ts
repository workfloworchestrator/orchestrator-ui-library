import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
    GraphqlQueryVariables,
    WorkflowDefinition,
    WorkflowDefinitionsResult,
} from '../../types';

export const GET_CREATE_WORKFLOWS_GRAPHQL_QUERY: TypedDocumentNode<
    WorkflowDefinitionsResult<Pick<WorkflowDefinition, 'name' | 'description'>>,
    GraphqlQueryVariables<Pick<WorkflowDefinition, 'name' | 'description'>>
> = parse(gql`
    query CreateWorkflows($first: IntType!, $after: IntType!) {
        workflows(
            first: $first
            after: $after
            filterBy: { field: "target", value: "CREATE" }
        ) {
            page {
                name
                description
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
