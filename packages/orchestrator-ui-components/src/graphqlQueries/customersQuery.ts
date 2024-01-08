import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { CustomersResult } from '../types';

// Avoiding pagination by passing a large number to first. TODO: Fix this better
export const GET_CUSTOMER_GRAPHQL_QUERY: TypedDocumentNode<CustomersResult> =
    parse(gql`
        query Customers {
            customers(first: 1000000, after: 0) {
                page {
                    fullname
                    identifier
                    shortcode
                }
            }
        }
    `);
