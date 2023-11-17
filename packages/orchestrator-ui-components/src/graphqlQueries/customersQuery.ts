import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { CustomersResult } from '../types';

export const GET_CUSTOMER_GRAPHQL_QUERY: TypedDocumentNode<CustomersResult> =
    parse(gql`
        query Customers {
            customers {
                page {
                    fullname
                    identifier
                    shortcode
                }
            }
        }
    `);
