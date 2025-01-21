import { isDate } from 'moment/moment';

import { PortMode, ProductTag } from '@/components';
import { ProductBlockInstance, SubscriptionDetail } from '@/types';

// NOTE: There might potentially (?) be more productBlockInstances with portMod but we get the last one here
export const getPortMode = (
    productBlockInstances: ProductBlockInstance[],
): PortMode | undefined => {
    return productBlockInstances?.reduce(
        (portMode: PortMode | undefined, productBlockInstance) => {
            const portModeField =
                productBlockInstance.productBlockInstanceValues.find(
                    (productBlockInstanceValue) =>
                        productBlockInstanceValue.field === 'portMode',
                );
            if (!portMode && portModeField) {
                return portModeField.value as PortMode;
            }
            return portMode;
        },
        undefined,
    );
};

export const isEmpty = (obj: unknown) => {
    if (obj === undefined || obj === null) {
        return true;
    }
    if (isDate(obj)) {
        return false;
    }
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }
    if (typeof obj === 'string') {
        return obj.trim().length === 0;
    }
    if (typeof obj === 'object') {
        return Object.keys(obj).length === 0;
    }
    return false;
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
