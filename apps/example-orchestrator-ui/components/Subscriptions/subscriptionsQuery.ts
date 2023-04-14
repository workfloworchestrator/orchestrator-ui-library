import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
    PythiaSortOrder,
    SubscriptionGridQuery,
    SubscriptionGridQueryVariables,
    SubscriptionsSort,
} from '../../__generated__/graphql';
import { graphql } from '../../__generated__';

export const GET_SUBSCRIPTIONS_PAGINATED: TypedDocumentNode<
    SubscriptionGridQuery,
    SubscriptionGridQueryVariables
> = graphql(`
    query SubscriptionGrid(
        $first: Int!
        $after: Int!
        $sortBy: [SubscriptionsSort!]
        $filterBy: [[String!]!]
    ) {
        subscriptions(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
        ) {
            edges {
                node {
                    note
                    name
                    startDate
                    endDate
                    tag
                    vlanRange
                    description
                    product {
                        name
                        type
                        tag
                    }
                    organisation {
                        abbreviation
                        name
                    }
                    insync
                    status
                    subscriptionId
                }
            }
        }
    }
`);

export const DEFAULT_SUBSCRIPTIONS_SORT_ORDER: SubscriptionsSort[] = [
    { field: 'startDate', order: PythiaSortOrder.Desc },
];

export const GET_SUBSCRIPTIONS_PAGINATED_VARIABLES: SubscriptionGridQueryVariables =
    {
        first: 20,
        after: 20,
        sortBy: DEFAULT_SUBSCRIPTIONS_SORT_ORDER,
    };
