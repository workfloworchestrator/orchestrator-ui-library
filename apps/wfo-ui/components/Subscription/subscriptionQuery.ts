import { graphql } from '../../__generated__';
import {
    SubscriptionDetailCompleteQuery,
    SubscriptionDetailOutlineQuery,
} from '../../__generated__/graphql';
import {
    ExternalServiceBase,
    parseDate,
    parseDateToLocaleString,
    ProductBase,
    ProductBlockBase,
    ResourceTypeBase,
    SubscriptionDetailBase,
} from '@orchestrator-ui/orchestrator-ui-components';

// Todo: fixedInputs need to be implemented in backend
// https://github.com/workfloworchestrator/orchestrator-core/issues/304

// Todo: customerId will be implemented in backend
// https://github.com/workfloworchestrator/orchestrator-core/issues/238
export const GET_SUBSCRIPTION_DETAIL_OUTLINE = graphql(`
    query SubscriptionDetailOutline($id: String!) {
        subscriptions(filterBy: { field: "subscriptionId", value: $id }) {
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
export const GET_SUBSCRIPTION_DETAIL_COMPLETE = graphql(`
    query SubscriptionDetailComplete($id: String!) {
        subscriptions(filterBy: { field: "subscriptionId", value: $id }) {
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

export function mapApiResponseToSubscriptionDetail(
    graphqlResponse:
        | SubscriptionDetailOutlineQuery
        | SubscriptionDetailCompleteQuery,
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
                const resourceType: ResourceTypeBase = {
                    name: productBlock.resourceTypes.name,
                    title: productBlock.resourceTypes.title,
                    label: productBlock.resourceTypes?.label,
                    subscriptionInstanceId:
                        productBlock.resourceTypes.subscription_instance_id,
                    ownerSubscriptionId:
                        productBlock.resourceTypes.owner_subscription_id,
                    ...productBlock.resourceTypes,
                };
                const retValue: ProductBlockBase = {
                    id: productBlock.id,
                    ownerSubscriptionId: productBlock.ownerSubscriptionId,
                    parent: productBlock.parent ?? null,
                    resourceTypes: resourceType,
                };
                return retValue;
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
