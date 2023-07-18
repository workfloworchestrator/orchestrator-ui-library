import { SortOrder } from '@orchestrator-ui/orchestrator-ui-components';
import { graphql } from '../../__generated__';

export const SUBSCRIPTION_ID = 'subscriptionId';
export const DESCRIPTION = 'description';
export const STATUS = 'status';
export const INSYNC = 'insync';
export const PRODUCT_NAME = 'productName';
export const TAG = 'tag';
export const START_DATE = 'startDate';
export const END_DATE = 'endDate';
export const NOTE = 'note';


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

export type SubscriptionsQueryVariables = {
    first: number;
    after: number;
    sortBy: SubscriptionsSort | null;
    filterBy?: [string, string][];
};

export type SubscriptionsSort = {
    field: string;
    order: SortOrder;
};

export const DEFAULT_SORT_FIELD: keyof Subscription = 'startDate';
export const DEFAULT_SORT_ORDER: SortOrder = SortOrder.DESC;
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

// Todo: possible reuse of Subscription query
export const GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT = graphql(`
    query SubscriptionsTable(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
    ) {
        subscriptions(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
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
`);

// export const GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT: string = gql`
//     query SubscriptionGrid(
//         $first: Int!
//         $after: Int!
//         $sortBy: [SubscriptionsSort!]
//         $filterBy: [[String!]!]
//     ) {
//         subscriptions(
//             first: $first
//             after: $after
//             sortBy: $sortBy
//             filterBy: $filterBy
//         ) {
//             edges {
//                 node {
//                     note
//                     name
//                     startDate
//                     endDate
//                     tag
//                     description
//                     product {
//                         name
//                         type
//                         tag
//                     }
//                     insync
//                     status
//                     subscriptionId
//                 }
//             }
//             pageInfo {
//                 totalItems
//                 startCursor
//                 hasPreviousPage
//                 hasNextPage
//                 endCursor
//             }
//         }
//     }
// `;
