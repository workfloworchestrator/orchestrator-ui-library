import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { ProcessStepsResult } from '@/types';

export const GET_PROCESS_STEPS_GRAPHQL_QUERY: TypedDocumentNode<
    ProcessStepsResult,
    { processName: string }
> = parse(gql`
    query ProcessSteps($processName: String!) {
        workflows(filterBy: { field: "name", value: $processName }) {
            page {
                steps {
                    name
                    assignee
                }
            }
        }
    }
`);
