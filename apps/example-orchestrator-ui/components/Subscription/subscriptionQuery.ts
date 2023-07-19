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

export const GET_SUBSCRIPTION_DETAIL_OUTLINE = graphql(`
    query SubscriptionDetailOutline($id: String!) {
        subscriptions(filterBy: { field: "subscriptionId", value: $id }) {
            page {
                subscriptionId
                # does not exist
                # customerId
                description
                # todo should be implemented by backend
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
                    # type
                    productType
                }
                endDate
                startDate
                status
                # org is removed
                # organisation {
                #     abbreviation
                #     name
                #     website
                #     tel
                # }
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

export const GET_SUBSCRIPTION_DETAIL_COMPLETE = graphql(`
    query SubscriptionDetailComplete($id: String!) {
        subscriptions(filterBy: { field: "subscriptionId", value: $id }) {
            page {
                subscriptionId
                # does not exist
                # customerId
                description
                # todo should be implemented by backend
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
                    # type
                    productType
                }
                endDate
                startDate
                status
                # org is removed
                # organisation {
                #     abbreviation
                #     name
                #     website
                #     tel
                # }
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
        // If you have a customerId field in your subscriptions add it her:
        // customerId: subscription.customerId,
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
        // todo should be implemented by backend, temporary mapping to placeholder object
        fixedInputs: {
            fixedInputKey: 'fixedInputValue',
        },
        productBlocks: productBlocks,
        externalServices,
    };
}
