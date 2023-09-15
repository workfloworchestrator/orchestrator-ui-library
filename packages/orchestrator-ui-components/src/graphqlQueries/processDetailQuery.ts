import { parse } from 'graphql';
import { gql } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { ProcessesDetailResult } from '../types';

export const GET_PROCESS_DETAIL_GRAPHQL_QUERY: TypedDocumentNode<
    ProcessesDetailResult,
    { processId: string }
> = parse(gql`
    query ProcessDetail($processId: String!) {
        processes(filterBy: { value: $processId, field: "processId" }) {
            page {
                processId
                lastStatus
                createdBy
                startedAt
                lastModifiedAt
                lastStep
                workflowName
                steps {
                    name
                    status
                    stepId
                    executed
                    state
                }
                customer {
                    fullname
                }
                subscriptions {
                    page {
                        product {
                            name
                        }
                        description
                        subscriptionId
                    }
                }
            }
        }
    }
`);
