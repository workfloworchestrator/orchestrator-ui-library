import { gql } from 'graphql-request';
import { parse } from 'graphql/index';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    ProcessDetail,
    ProcessesDetailResult,
} from '@/types';

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
                isTask
                form
                steps {
                    name
                    status
                    stepId
                    executed
                    stateDelta
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

export const processDetailQuery = `query ProcessDetail($processId: String!) {
        processes(filterBy: { value: $processId, field: "processId" }) {
            page {
                processId
                lastStatus
                createdBy
                startedAt
                lastModifiedAt
                lastStep
                workflowName
                isTask
                form
                steps {
                    name
                    status
                    stepId
                    executed
                    stateDelta
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
    }`;

export type ProcessDetailResponse = {
    processes: ProcessDetail[];
} & BaseGraphQlResult;

const processDetailApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getProcessDetail: builder.query<
            ProcessDetailResponse,
            GraphqlQueryVariables<{ processId: string }>
        >({
            query: (variables) => ({
                document: processDetailQuery,
                variables,
            }),
            transformResponse: (response) => {
                return {};
            },
        }),
    }),
});
