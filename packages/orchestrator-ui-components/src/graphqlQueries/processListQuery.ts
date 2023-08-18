import { parse } from 'graphql';
import { gql } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphqlQueryVariables, Process, ProcessesResult } from '../types';

export const GET_PROCESS_LIST_GRAPHQL_QUERY: TypedDocumentNode<
    ProcessesResult,
    GraphqlQueryVariables<Process>
> = parse(gql`
    query ProcessList(
        $first: IntType!
        $after: IntType!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
    ) {
        processes(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
        ) {
            page {
                workflowName
                step
                status
                product
                customer
                createdBy
                assignee
                processId
                started
                lastModified
                workflowTarget
                subscriptions {
                    page {
                        subscriptionId
                        description
                    }
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
                endCursor
            }
        }
    }
`);
