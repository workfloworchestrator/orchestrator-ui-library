import { parse } from 'graphql';
import { gql } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { SubscriptionDetail } from '../types/subscription';
import {
    ExternalServiceBase,
    GraphqlQueryVariables,
    ProductBase,
    ProductBlockBase,
    SubscriptionDetailBase,
    SubscriptionDetailResult,
} from '../types';
import { parseDate, parseDateToLocaleString } from '../utils/date';

// Example test data: 47f35846-a55a-40c4-ab4c-2ae0574ecf3c
//
//     subscriptionId: string
//     description: string
//     # fixedInputs
//     insync: boolean
//     note?: string
//     product {
//         createdAt?: string (DateTime as string)
//         name: string
//         status: ProductLifecycle (enum: "ACTIVE" "PRE_PRODUCTION" "PHASE_OUT" "END_OF_LIFE"
//         endDate?: string (DateTime as string)
//         description: string
//         tag: string
//         productType: string
//     }
//     endDate?: string (DateTime as string)
//     startDate?: string (DateTime as string)
//     status: SubscriptionLifecycle (enum: "INITIAL" "ACTIVE" "MIGRATING" "DISABLED" "TERMINATED" "PROVISIONING")
//     productBlocks {
//         id: int
//         ownerSubscriptionId: string
//         parent?: int
//         resourceTypes: object (key value pairs)
//     }

// Todo: fixedInputs need to be implemented in backend
// https://github.com/workfloworchestrator/orchestrator-core/issues/304

// Todo: customerId will be implemented in backend
// https://github.com/workfloworchestrator/orchestrator-core/issues/238

const GET_SUBSCRIPTION_DETAIL_OUTLINE = parse(gql`
    query SubscriptionDetailComplete($filterBy: [GraphqlFilter!]) {
        subscriptions(filterBy: $filterBy) {
            page {
                subscriptionId
                description
                # fixedInputs
                insync
                note
                product {
                    createdAt
                    name
                    status
                    endDate
                    description
                    tag
                    productType
                }
                endDate
                startDate
                status
                productBlocks {
                    id
                    ownerSubscriptionId
                    parent
                    resourceTypes
                }
            }
        }
    }
`);

// Todo: fixedInputs need to be implemented in backend
// https://github.com/workfloworchestrator/orchestrator-core/issues/304
export const GET_SUBSCRIPTION_DETAIL_COMPLETE = parse(gql`
    query SubscriptionDetailComplete($filterBy: [GraphqlFilter!]) {
        subscriptions(filterBy: $filterBy) {
            page {
                subscriptionId
                description
                # fixedInputs
                insync
                note
                product {
                    createdAt
                    name
                    status
                    endDate
                    description
                    tag
                    productType
                }
                endDate
                startDate
                status
                productBlocks {
                    id
                    ownerSubscriptionId
                    parent
                    resourceTypes
                }
            }
        }
    }
`);

export function getSubscriptionsDetailOutlineGraphQlQuery<
    DataType = SubscriptionDetail,
>(): TypedDocumentNode<
    SubscriptionDetailResult,
    GraphqlQueryVariables<DataType>
> {
    return GET_SUBSCRIPTION_DETAIL_OUTLINE;
}

export function getSubscriptionsDetailCompleteGraphQlQuery<
    DataType = SubscriptionDetail,
>(): TypedDocumentNode<
    SubscriptionDetailResult,
    GraphqlQueryVariables<DataType>
> {
    return GET_SUBSCRIPTION_DETAIL_COMPLETE;
}

export function mapApiResponseToSubscriptionDetail(
    graphqlResponse: SubscriptionDetailResult,
    externalServicesLoaded: boolean,
): SubscriptionDetailBase {
    const subscription = graphqlResponse.subscriptions.page[0];

    const product: ProductBase = {
        name: subscription.product.name,
        description: subscription.product.description,
        status: subscription.product.status,
        tag: subscription.product.tag ?? '',
        type: subscription.product.productType,
        createdAt: parseDateToLocaleString(
            parseDate(subscription.product.createdAt) as Date,
        ),
        endDate: parseDateToLocaleString(
            parseDate(subscription.product.endDate ?? null),
        ),
    };

    const productBlocks: ProductBlockBase[] = subscription.productBlocks.map(
        (productBlock) => {
            {
                const productBlockBase: ProductBlockBase = {
                    id: productBlock.id,
                    ownerSubscriptionId: productBlock.ownerSubscriptionId,
                    parent: productBlock.parent ?? null,
                    // @ts-ignore
                    resourceTypes: productBlock.resourceTypes,
                };
                return productBlockBase;
            }
        },
    );

    const externalServices: ExternalServiceBase[] | undefined =
        externalServicesLoaded ? [] : undefined;

    return {
        subscriptionId: subscription.subscriptionId,
        description: subscription.description,
        insync: subscription.insync,
        status: subscription.status,
        startDate: parseDateToLocaleString(
            parseDate(subscription.startDate ?? null),
        ),
        endDate: parseDateToLocaleString(
            parseDate(subscription.endDate ?? null),
        ),
        note: subscription?.note ?? '',
        product: product,
        // Todo: fixedInputs need to be implemented in backend
        // https://github.com/workfloworchestrator/orchestrator-core/issues/304
        fixedInputs: {
            fixedInputKey: 'fixedInputValue',
        },
        productBlocks: productBlocks,
        externalServices,
    };
}

// export function mapApiResponseToSubscriptionDetail(
//     graphqlResponse:
//         | SubscriptionDetailOutlineQuery
//         | SubscriptionDetailCompleteQuery,
//     externalServicesLoaded: boolean,
// ): SubscriptionDetailBase {
//     const subscription = graphqlResponse.subscriptions.page[0];
//
//     const product: ProductBase = {
//         name: subscription.product.name,
//         description: subscription.product.description,
//         status: subscription.product.status,
//         tag: subscription.product.tag ?? '',
//         type: subscription.product.productType,
//         createdAt: parseDateToLocaleString(
//             parseDate(subscription.product.createdAt) as Date,
//         ),
//         endDate: parseDateToLocaleString(
//             parseDate(subscription.product.endDate ?? null),
//         ),
//     };
//
//     const productBlocks: ProductBlockBase[] = subscription.productBlocks.map(
//         (productBlock) => {
//             {
//                 const resourceType: ResourceTypeBase = {
//                     name: productBlock.resourceTypes.name,
//                     title: productBlock.resourceTypes.title,
//                     label: productBlock.resourceTypes?.label,
//                     subscriptionInstanceId:
//                         productBlock.resourceTypes.subscription_instance_id,
//                     ownerSubscriptionId:
//                         productBlock.resourceTypes.owner_subscription_id,
//                     ...productBlock.resourceTypes,
//                 };
//                 const retValue: ProductBlockBase = {
//                     id: productBlock.id,
//                     ownerSubscriptionId: productBlock.ownerSubscriptionId,
//                     parent: productBlock.parent ?? null,
//                     resourceTypes: resourceType,
//                 };
//                 return retValue;
//             }
//         },
//     );
//
//     const externalServices: ExternalServiceBase[] | undefined =
//         externalServicesLoaded ? [] : undefined;
//
//     return {
//         subscriptionId: subscription.subscriptionId,
//         description: subscription.description,
//         insync: subscription.insync,
//         status: subscription.status,
//         startDate: parseDateToLocaleString(
//             parseDate(subscription.startDate ?? null),
//         ),
//         endDate: parseDateToLocaleString(
//             parseDate(subscription.endDate ?? null),
//         ),
//         note: subscription?.note ?? '',
//         product: product,
//         // Todo: fixedInputs need to be implemented in backend
//         // https://github.com/workfloworchestrator/orchestrator-core/issues/304
//         fixedInputs: {
//             fixedInputKey: 'fixedInputValue',
//         },
//         productBlocks: productBlocks,
//         externalServices,
//     };
// }
