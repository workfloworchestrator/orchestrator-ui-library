import { useQueryWithGraphql } from '../useQueryWithGraphql';
import { GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import {
    subscriptionHasPortModeInstanceValue,
    subscriptionHasTaggedProduct,
} from '../../components/WfoForms/formFields/utils';
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
