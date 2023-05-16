import { graphql } from '../../__generated__';
import {
    GetSubscriptionDetailCompleteQuery,
    GetSubscriptionDetailEnrichedQuery,
    GetSubscriptionDetailOutlineQuery,
    MyBaseSubscriptionEdge,
    SubscriptionGridQuery,
    SubscriptionsSort,
} from '../../__generated__/graphql';
import subscriptionId from '../../pages/subscriptions/[subscriptionId]';

export const GET_SUBSCRIPTION_DETAIL_OUTLINE = graphql(`
    query GetSubscriptionDetailOutline($id: ID!) {
        subscription(id: $id) {
            customerId
            description
            endDate
            firewallEnabled
            fixedInputs
            insync
            note
            product {
                name
                status
                endDate
                description
                tag
                type
            }
            startDate
            status
            subscriptionId
            customerDescriptions {
                description
            }
            organisation {
                abbreviation
                name
                website
                tel
            }
            locations {
                abbreviation
                name
            }
            productBlocks {
                id
                ownerSubscriptionId
                parent
                resourceTypes
            }
        }
    }
`);

export const GET_SUBSCRIPTION_DETAIL_COMPLETE = graphql(`
    query GetSubscriptionDetailComplete($id: ID!) {
        subscription(id: $id) {
            note
            name
            startDate
            endDate
            tag
            vlanRange
            customerId
            customerDescriptions {
                description
                customerId
            }
            description
            firewallEnabled
            fixedInputs
            product {
                name
                status
                endDate
                tag
                type
                description
                createdAt
            }
            status
            locations {
                name
                email
                website
                abbreviation
            }
            inUseBy {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            dependsOn {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            organisation {
                abbreviation
                email
                fax
                name
                status
                tel
                website
                customerId
            }
            productBlocks {
                id
                ownerSubscriptionId
                parent
                resourceTypes
            }
        }
    }
`);

export const GET_SUBSCRIPTION_DETAIL_ENRICHED = graphql(`
    query GetSubscriptionDetailEnriched($id: ID!) {
        subscription(id: $id) {
            note
            name
            startDate
            endDate
            tag
            vlanRange
            customerId
            customerDescriptions {
                description
                customerId
            }
            description
            firewallEnabled
            fixedInputs
            product {
                name
                status
                endDate
                tag
                type
                description
                createdAt
            }
            status
            locations {
                name
                email
                website
                abbreviation
            }
            imsCircuits {
                ims {
                    id
                    name
                    extraInfo
                    aliases
                    allEndpoints {
                        vlanranges
                        ... on ImsPort {
                            id
                            connectorType
                            fiberType
                            ifaceType
                            lineName
                            node
                            patchposition
                            port
                            status
                            type
                            vlanranges
                        }
                        id
                        type
                        ... on ImsInternalPort {
                            id
                            lineName
                            node
                            port
                            type
                            vlanranges
                        }
                        ... on ImsService {
                            id
                            location
                            type
                            vlanranges
                        }
                        location
                    }
                }
            }
            inUseBy {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            dependsOn {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            organisation {
                abbreviation
                email
                fax
                name
                status
                tel
                website
                customerId
            }
            productBlocks {
                id
                ownerSubscriptionId
                parent
                resourceTypes
            }
        }
    }
`);

type SubscriptionDetailBase = {
    subscriptionId: any;
    description: string;
    fixedInputs: any;
    status: string; // Todo: it would be nice if we could be stricter here (for EuiBadge components)
    insync: boolean;
    startDate: string;
    endDate?: string;
    product: any;
    organisation?: any;
    customerDescriptions: any[];
    note?: string;
    locations: any[];
    productBlocks: any[];
};

function mapApiResponseToSubscriptionDetail(
    graphqlResponse:
        | GetSubscriptionDetailOutlineQuery
        | GetSubscriptionDetailCompleteQuery
        | GetSubscriptionDetailEnrichedQuery,
): SubscriptionDetailBase {
    const subscription = graphqlResponse.subscription;

    return {
        subscriptionId: subscription.subscriptionId,
        description: subscription.description,
        fixedInputs: subscription.fixedInputs,
        status: subscription.status,
        insync: subscription?.insync,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        product: subscription.product,
        organisation: subscription.organisation,
        customerDescriptions: subscription.customerDescriptions,
        note: subscription.note,
        locations: subscription.locations,
        productBlocks: subscription.productBlocks,
    };
}
