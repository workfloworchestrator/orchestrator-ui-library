import { gql, request } from 'graphql-request';
import { GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES } from './subscriptionsQuery';

// Note: the types of the props need to be verified, some props might be removed and replaced with a generic key value pair type:
// [key: string]: number | string | boolean | undefined
type Subscription = {
    note: null | string;
    name: null | string;
    startDate: null | string;
    endDate: null | string;
    tag: null | string;
    vlanRange: unknown; // TODO: type this
    description: null | string;
    product: object; // TODO: type this
    organisation: object; // TODO: type this
    insync: boolean;
    status: string; // This might be an enum
    subscriptionId: string;
};

type PageInfo = {
    totalItems: string;
    startCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    endCursor: string;
};

// Placing the expected return type right next to the query shows what we (Frontend) expect
type SubscriptionsResult = {
    subscriptions: {
        edges: {
            node: Subscription;
        }[];
        pageInfo: PageInfo;
    };
};

export const getQuery2Result = async () => {
    const document = gql`
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

    return await request<SubscriptionsResult>(
        'https://api.dev.automation.surf.net/pythia',
        document,
        GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
    );
};
