import { parse } from 'graphql';
import { gql } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
    RelatedSubscriptionsResult,
    GraphqlQueryVariables,
    RelatedSubscription,
    Subscription,
} from '../types';

export const GET_RELATED_SUBSCRIPTIONS_GRAPHQL_QUERY: TypedDocumentNode<
    RelatedSubscriptionsResult,
    GraphqlQueryVariables<RelatedSubscription> &
        Pick<Subscription, 'subscriptionId'>
> = parse(gql`
    query RelatedSubscriptions(
        $subscriptionId: String!
        $first: IntType!
        $after: IntType!
    ) {
        subscriptions(
            filterBy: { value: $subscriptionId, field: "subscriptionId" }
        ) {
            page {
                subscriptionId
                inUseBySubscriptions(first: $first, after: $after) {
                    page {
                        subscriptionId
                        customer {
                            fullname
                        }
                        description
                        insync
                        startDate
                        status
                        product {
                            tag
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                        startCursor
                        totalItems
                    }
                }
            }
        }
    }
`);
