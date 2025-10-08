import {
    subscriptionHasTaggedPortModeInstanceValue,
    subscriptionHasTaggedProduct,
} from '@/components/WfoForms/formFields/utils';
import { useGetSubscriptionDetailQuery } from '@/rtk/endpoints/subscriptionDetail';

export const useIsTaggedPort = (subscriptionId: string): [boolean, boolean] => {
    const { data, isFetching } = useGetSubscriptionDetailQuery(
        { subscriptionId },
        { skip: !subscriptionId },
    );
    const subscriptionDetail = data?.subscription;

    // The ports portMode is tagged (with a vlan) when:
    // - The subscription contains a productBlockInstance with a productBlockInstanceValue with  the property port_mode and
    // its value is 'tagged': subscriptionHasTaggedProduct: subscriptionHasPortModeInstanceValue
    // - The subscriptions product tag is MSC, MSCNL or IRBSP: subscriptionHasTaggedProduct

    const portIsTagged = subscriptionDetail
        ? subscriptionHasTaggedPortModeInstanceValue(subscriptionDetail) ||
          subscriptionHasTaggedProduct(subscriptionDetail)
        : false;

    return [!isFetching, portIsTagged];
};
