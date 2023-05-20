import { graphql } from '../../__generated__';
import {
    GetSubscriptionDetailCompleteQuery,
    GetSubscriptionDetailEnrichedQuery,
    GetSubscriptionDetailOutlineQuery,
} from '../../__generated__/graphql';

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
    product: any; // Shape is known a mapping could be made product.name, product.tag, product.endDate,
    organisation?: any; // Shape is known a mapping could be made
    customerDescriptions: any[]; // SURF Specific
    note?: string;
    locations: any[]; // Shape is known a mapping could be made: SURF Specific?
    productBlocks: any[]; // Shape is known a mapping could be made
};

type GenericField = { [key: string]: number | string | boolean };

type SubscriptionBlock = {
    subscriptionId: string;
    insync: boolean;
    note?: string;
} & GenericField;

function mapApiResponseToSubscriptionDetail(
    graphqlResponse:
        | GetSubscriptionDetailOutlineQuery
        | GetSubscriptionDetailCompleteQuery
        | GetSubscriptionDetailEnrichedQuery,
): SubscriptionDetailBase {
    const subscription = graphqlResponse.subscription;

    const blaat: SubscriptionBlock = {
        subscriptionId: '123',
        insync: true,
        test: 'floemp',
    };
    console.log(blaat);

    let subscriptionDetail = {
        subscriptionId: subscription.subscriptionId,
        description: subscription.description,
        fixedInputs: subscription.fixedInputs,
        status: subscription.status,
        insync: subscription.insync,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        product: subscription.product,
        organisation: subscription.organisation,
        customerDescriptions: subscription.customerDescriptions,
        note: subscription.note,
        locations: subscription.locations,
        productBlocks: subscription.productBlocks,
    };
    if (graphqlResponse instanceof GetSubscriptionDetailCompleteQuery) {
    }

    return subscriptionDetail;
}
