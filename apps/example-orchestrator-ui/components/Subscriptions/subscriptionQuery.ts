import { gql } from 'graphql-request';
import { SortDirection } from '@orchestrator-ui/orchestrator-ui-components';

export type SubscriptionsResult = {
    subscriptions: {
        edges: {
            node: Subscription;
        }[];
        pageInfo: PageInfo;
    };
};

export type Subscription = {
    note: string | null;
    name: string | null;
    startDate: string | null;
    endDate: string | null;
    tag: string | null;
    description: string;
    product: Product;
    insync: boolean;
    status: string;
    subscriptionId: string;
};

export type Product = {
    name: string;
    type: string;
    tag: string | null;
};

export type PageInfo = {
    totalItems: string;
    startCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    endCursor: string;
};

export type SubscriptionsQueryVariables = {
    first: number;
    after: number;
    sortBy: SubscriptionsSort | null;
};

export type SubscriptionsSort = {
    field: string;
    order: SortDirection;
};

export const DEFAULT_SORT_FIELD: keyof Subscription = 'startDate';
export const DEFAULT_SORT_ORDER: SortDirection = SortDirection.Desc;
export const DEFAULT_SUBSCRIPTIONS_SORT_ORDER: SubscriptionsSort = {
    field: DEFAULT_SORT_FIELD,
    order: DEFAULT_SORT_ORDER,
};
export const GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES: SubscriptionsQueryVariables =
    {
        first: 20,
        after: 0,
        sortBy: DEFAULT_SUBSCRIPTIONS_SORT_ORDER,
    };

export const GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT: string = gql`
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
                    description
                    product {
                        name
                        type
                        tag
                    }
                    insync
                    status
                    subscriptionId
                }
            }
            pageInfo {
                totalItems
                startCursor
                hasPreviousPage
                hasNextPage
                endCursor
            }
        }
    }
`;
