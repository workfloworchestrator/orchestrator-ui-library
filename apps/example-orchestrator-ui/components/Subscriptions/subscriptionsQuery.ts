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

export const DEFAULT_SORT_FIELD = 'startDate';
export const DEFAULT_SORT_ORDER = PythiaSortOrder.Desc;

export const DEFAULT_SUBSCRIPTIONS_SORT_ORDER: SubscriptionsSort = {
    field: DEFAULT_SORT_FIELD,
    order: DEFAULT_SORT_ORDER,
};

export const GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES: SubscriptionGridQueryVariables =
    {
        first: 20,
        after: 0,
        sortBy: DEFAULT_SUBSCRIPTIONS_SORT_ORDER,
    };

// Todo move to utils file (keep in app, not lib)
export const getSortOrderValue = (isDescending: boolean) =>
    isDescending ? PythiaSortOrder.Desc : PythiaSortOrder.Asc;

export const sortOrderIsDescending = (sortOrder: PythiaSortOrder) =>
    sortOrder === PythiaSortOrder.Desc;

export const getFlippedSortOrderValue = (sortOrder: PythiaSortOrder) =>
    sortOrder === PythiaSortOrder.Desc
        ? PythiaSortOrder.Asc
        : PythiaSortOrder.Desc;
