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

// todo remove me
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
