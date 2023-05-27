import { graphql } from '../../__generated__';
import {
    GetSubscriptionDetailCompleteQuery,
    GetSubscriptionDetailOutlineQuery,
} from '../../__generated__/graphql';
import {
    ExternalServiceBase,
    OrganisationBase,
    ProductBase,
    ProductBlockBase,
    ResourceTypeBase,
    SubscriptionDetailBase,
} from '@orchestrator-ui/orchestrator-ui-components';

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

// export const GET_SUBSCRIPTION_DETAIL_COMPLETE = graphql(`
//     query GetSubscriptionDetailComplete($id: ID!) {
//         subscription(id: $id) {
//             subscriptionId
//             customerId
//             description
//             fixedInputs
//             insync
//             note
//             product {
//                 createdAt
//                 name
//                 status
//                 endDate
//                 description
//                 tag
//                 type
//             }
//             endDate
//             startDate
//             status
//             organisation {
//                 abbreviation
//                 name
//                 website
//                 tel
//             }
//             productBlocks {
//                 id
//                 ownerSubscriptionId
//                 parent
//                 resourceTypes
//             }
//         }
//     }
// `);

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

export function mapApiResponseToSubscriptionDetail(
    graphqlResponse:
        | GetSubscriptionDetailOutlineQuery
        | GetSubscriptionDetailCompleteQuery,
    externalServicesLoaded: boolean,
): SubscriptionDetailBase {
    const subscription = graphqlResponse.subscription;

    const product: ProductBase = {
        name: subscription.product.name,
        description: subscription.product.description,
        status: subscription.product.status,
        tag: subscription.product.tag,
        type: subscription.product.type,
        createdAt: subscription.product.createdAt,
        endDate: subscription.product?.endDate,
    };

    const productBlocks: ProductBlockBase[] = subscription.productBlocks.map(
        (productBlock) => {
            {
                const resourceType: ResourceTypeBase = {
                    name: productBlock.resourceTypes.name,
                    title: productBlock.resourceTypes.title,
                    label: productBlock.resourceTypes?.label,
                    subscriptionInstanceId:
                        productBlock.resourceTypes.subscription_instance_id, // Todo: pythia naming
                    ownerSubscriptionId:
                        productBlock.resourceTypes.owner_subscription_id, // Todo: pythia naming
                    ...productBlock.resourceTypes,
                };
                // Todo: add remaining stuff
                const retValue: ProductBlockBase = {
                    id: productBlock.id,
                    ownerSubscriptionId: productBlock.ownerSubscriptionId,
                    parent: productBlock.parent,
                    resourceTypes: resourceType,
                };
                return retValue;
            }
        },
    );

    const organisation: OrganisationBase = {
        name: subscription.organisation.name,
        abbreviation: subscription.organisation.abbreviation,
    };
    let externalServices: ExternalServiceBase[] = [];
    if (externalServicesLoaded) {
        // @ts-ignore
        externalServices = subscription?.imsCircuits.map((service) => {
            {
                const externalService: ExternalServiceBase = {
                    externalServiceId: service.ims.id,
                    externalServiceData: { ...service.ims },
                    externalServiceKey: 'ims',
                };
                return externalService;
            }
        });
        console.log('External services loaded and mapped:', externalServices);
    }

    return {
        subscriptionId: subscription.subscriptionId,
        description: subscription.description,
        customerId: subscription.customerId,
        insync: subscription.insync,
        status: subscription.status,
        startDate: subscription?.startDate,
        endDate: subscription?.endDate,
        note: subscription?.note,
        product: product,
        fixedInputs: subscription.fixedInputs,
        organisation: organisation,
        productBlocks: productBlocks,
        externalServices: externalServices,
    };
}
