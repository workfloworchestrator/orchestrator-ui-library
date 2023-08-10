import { gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import type {
    WorkflowDefinition,
    GraphqlQueryVariables,
    WorkflowDefinitionsResult,
} from '@orchestrator-ui/orchestrator-ui-components';

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
                productTags
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
