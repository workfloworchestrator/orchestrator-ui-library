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
