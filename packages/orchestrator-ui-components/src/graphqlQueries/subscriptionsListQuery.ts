import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {
    GraphqlQueryVariables,
    Subscription,
    SubscriptionsResult,
} from '@/types';

export const GET_SUBSCRIPTIONS_LIST_GRAPHQL_QUERY = parse(gql`
    query SubscriptionsList(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
        $query: String
    ) {
        subscriptions(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
            query: $query
        ) {
            page {
                note
                startDate
                endDate
                description
                insync
                status
                subscriptionId
                product {
                    name
                    tag
                    productType
                }
                customer {
                    fullname
                    shortcode
                }
            }
            pageInfo {
                totalItems
                startCursor
                hasPreviousPage
                hasNextPage
                endCursor
                sortFields
                filterFields
            }
        }
    }
`);

export function getSubscriptionsListGraphQlQuery<
    QueryVariablesType = Subscription,
>(): TypedDocumentNode<
    SubscriptionsResult,
    GraphqlQueryVariables<QueryVariablesType>
> {
    return GET_SUBSCRIPTIONS_LIST_GRAPHQL_QUERY;
}
