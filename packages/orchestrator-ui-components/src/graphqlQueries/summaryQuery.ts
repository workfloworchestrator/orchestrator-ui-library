import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { SummaryResult } from '@/types';

type SummaryQueryVariables = {
    first?: number;
};

export const GET_SUMMARY_GRAPHQL_QUERY: TypedDocumentNode<
    SummaryResult,
    SummaryQueryVariables
> = parse(gql`
    query Summary($first: Int!) {
        subscriptions(
            first: $first
            after: 0
            sortBy: { field: "startDate", order: DESC }
            filterBy: [{ field: "status", value: "ACTIVE" }]
        ) {
            page {
                description
                subscriptionId
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
        processes(
            first: $first
            after: 0
            sortBy: { field: "startedAt", order: DESC }
            filterBy: [
                {
                    field: "lastStatus"
                    value: "created-running-suspended-waiting-failed-resumed"
                }
            ]
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
        tasks: processes(
            first: $first
            after: 0
            sortBy: { field: "startedAt", order: DESC }
            filterBy: [
                { field: "lastStatus", value: "failed" }
                { field: "isTask", value: "true" }
            ]
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
        products(first: 1000, sortBy: { field: "name", order: ASC }) {
            page {
                name
                subscriptions {
                    pageInfo {
                        totalItems
                    }
                }
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
    }
`);
