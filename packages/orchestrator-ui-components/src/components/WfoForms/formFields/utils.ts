import { GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY } from '../../../graphqlQueries';
import { useQueryWithGraphql } from '../../../hooks';
import { ProductBlockInstance, SubscriptionDetail } from '../../../types';

export enum PortMode {
    TAGGED = 'tagged',
    UNTAGGED = 'untagged',
    LINK_MEMBER = 'link_member',
}

export enum ProductTag {
    MSC = 'MSC',
    MSCNL = 'MSCNL',
    IRBSP = 'IRBSP',
}

export const subscriptionHasPortModeInstanceValue = (
    subscriptionDetail: SubscriptionDetail,
): boolean => {
    const hasTaggedPortModeInstanceValue =
        subscriptionDetail.productBlockInstances.reduce(
            (
                hasTaggedPortMode: boolean,
                productBlock: ProductBlockInstance,
            ) => {
                return (
                    hasTaggedPortMode ||
                    !!productBlock.productBlockInstanceValues.find(
                        ({ field, value }) =>
                            field === 'portMode' && value === 'tagged',
                    )
                );
            },
            false,
        );

    return hasTaggedPortModeInstanceValue;
};

export const subscriptionHasTaggedProduct = (
    subscriptionDetail: SubscriptionDetail,
): boolean => {
    const productsWithTaggedPorts: string[] = [
        ProductTag.MSC,
        ProductTag.MSCNL,
        ProductTag.IRBSP,
    ];
    return productsWithTaggedPorts.includes(subscriptionDetail.product.tag)
        ? true
        : false;
};

export const useIsTaggedPort = (subscriptionId: string): [boolean, boolean] => {
    const { data, isFetched } = useQueryWithGraphql(
        GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY,
        { subscriptionId },
        `subscription-${subscriptionId}`,
        false,
        !!subscriptionId,
    );
    const subscriptionDetail = data?.subscriptions.page[0];

    // The ports portMode is tagged (with a vlan) when:
    // - The subscription contains a productBlockInstance with a productBlockInstanceValue with  the property port_mode and
    // its value is 'tagged': subscriptionHasTaggedProduct: subscriptionHasPortModeInstanceValue
    // - The subscriptions product tag is MSC, MSCNL or IRBSP: subscriptionHasTaggedProduct

    const portIsTagged = subscriptionDetail
        ? subscriptionHasPortModeInstanceValue(subscriptionDetail) ||
          subscriptionHasTaggedProduct(subscriptionDetail)
        : false;

    return [isFetched, portIsTagged];
};
