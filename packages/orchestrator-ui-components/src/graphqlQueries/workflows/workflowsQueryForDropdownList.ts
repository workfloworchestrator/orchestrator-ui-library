import { parse } from 'graphql';
import { gql } from 'graphql-request';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {
    GraphqlQueryVariables,
    WorkflowDefinition,
    WorkflowDefinitionsResult,
} from '../../types';

// Avoiding pagination by passing a large number to first. TODO: Fix this better
export const GET_WORKFLOWS_FOR_DROPDOWN_LIST_GRAPHQL_QUERY: TypedDocumentNode<
    WorkflowDefinitionsResult<WorkflowDefinition>,
    GraphqlQueryVariables<WorkflowDefinition>
> = parse(gql`
    query StartWorkflows($filterBy: [GraphqlFilter!]) {
        workflows(first: 1000000, after: 0, filterBy: $filterBy) {
            page {
                name
                description
                products {
                    productId
                    name
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
