import { graphql } from '../../__generated__';
import {
    GetSubscriptionDetailCompleteQuery,
    GetSubscriptionDetailOutlineQuery,
} from '../../__generated__/graphql';
import { SubscriptionBlockBase } from '@orchestrator-ui/orchestrator-ui-components';

export const GET_SUBSCRIPTION_DETAIL_OUTLINE = graphql(`
    query GetSubscriptionDetailOutline($id: ID!) {
        subscription(id: $id) {
            subscriptionId
            customerId
            description
            fixedInputs
            insync
            note
            product {
                createdAt
                name
                status
                endDate
                description
                tag
                type
            }
            endDate
            startDate
            status
            organisation {
                abbreviation
                name
                website
                tel
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
            subscriptionId
            customerId
            description
            fixedInputs
            insync
            note
            product {
                createdAt
                name
                status
                endDate
                description
                tag
                type
            }
            endDate
            startDate
            status
            organisation {
                abbreviation
                name
                website
                tel
            }
            productBlocks {
                id
                ownerSubscriptionId
                parent
                resourceTypes
            }
            imsCircuits {
                ims {
                    product
                    speed
                    id
                    extraInfo
                    endpoints(type: PORT) {
                        id
                        location
                        type
                        ... on ImsPort {
                            id
                            lineName
                            fiberType
                            ifaceType
                            patchposition
                            port
                            status
                            node
                            type
                            vlanranges
                            connectorType
                        }
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
                            type
                            vlanranges
                        }
                        vlanranges
                    }
                    location
                    name
                }
            }
        }
    }
`);

export function mapApiResponseToSubscriptionBlock(
    graphqlResponse:
        | GetSubscriptionDetailOutlineQuery
        | GetSubscriptionDetailCompleteQuery,
): SubscriptionBlockBase {
    const subscription = graphqlResponse.subscription;

    const block: SubscriptionBlockBase = {
        subscriptionId: subscription.subscriptionId as string,
        description: subscription.description,
        insync: subscription.insync as boolean,
        status: subscription.status,
        customerId: subscription.customerId,
        note: subscription?.note,
    };
    return block;
}
