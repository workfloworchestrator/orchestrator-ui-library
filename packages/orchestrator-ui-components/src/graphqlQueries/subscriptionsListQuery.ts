import { parse } from 'graphql';
import { gql } from 'graphql-request';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import {
    GraphqlQueryVariables,
    Subscription,
    SubscriptionsResult,
} from '@/types';

export const GET_SUBSCRIPTIONS_LIST_SUMMARY_GRAPHQL_QUERY = parse(gql`
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
                startDate
                description
                subscriptionId
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
    }
`);

export const getSubscriptionsListSummaryGraphQlQuery = <
    QueryVariablesType = Subscription,
>(): TypedDocumentNode<
    SubscriptionsResult<
        Pick<Subscription, 'subscriptionId' | 'description' | 'startDate'>
    >,
    GraphqlQueryVariables<QueryVariablesType>
> => GET_SUBSCRIPTIONS_LIST_SUMMARY_GRAPHQL_QUERY;
