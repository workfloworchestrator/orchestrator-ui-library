import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { GraphqlQueryVariables, Process, ProcessListResult } from '@/types';

export const GET_PROCESS_LIST_SUMMARY_GRAPHQL_QUERY = parse(gql`
    query ProcessListSummary(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
        $query: String
    ) {
        processes(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
            query: $query
        ) {
            page {
                processId
                workflowName
                startedAt
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
    }
`);

export const getProcessListSummaryGraphQlQuery = (): TypedDocumentNode<
    ProcessListResult<
        Pick<Process, 'processId' | 'workflowName' | 'startedAt'>
    >,
    GraphqlQueryVariables<Process>
> => GET_PROCESS_LIST_SUMMARY_GRAPHQL_QUERY;
