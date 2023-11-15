import { ProductBlockInstance, SubscriptionDetail } from '../../../types';

import { ProductTag, PortMode } from './types';

// NOTE: There might potentially (?) be more productBlockInstances with portMod but we get the last one here
export const getPortMode = (
    productBlockInstances: ProductBlockInstance[],
): PortMode | undefined => {
    const portMode = productBlockInstances.reduce(
        (portMode: PortMode | undefined, productBlockInstance) => {
            const portModeField =
                productBlockInstance.productBlockInstanceValues.find(
                    (productBlockInstanceValue) =>
                        productBlockInstanceValue.field === 'portMode',
                );
            if (portModeField) {
                return portModeField.value as PortMode;
            }
            return portMode;
        },
        undefined,
    );

    return portMode;
};

export const subscriptionHasTaggedPortModeInstanceValue = (
    subscriptionDetail: SubscriptionDetail,
): boolean => {
    const portMode = getPortMode(subscriptionDetail.productBlockInstances);
    return portMode && portMode === PortMode.TAGGED ? true : false;
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
