import { SubscriptionsResult } from '../../types';
import { SubscriptionListItem } from './types';

export function mapGrapghQlSubscriptionsResultToSubscriptionListItems(
    graphqlResponse: SubscriptionsResult,
): SubscriptionListItem[] {
    return graphqlResponse.subscriptions.page.map((subscription) => {
        const {
            description,
            insync,
            product,
            startDate,
            endDate,
            status,
            subscriptionId,
            note,
        } = subscription;

        const { name: productName, tag } = product;

        return {
            description,
            insync,
            productName,
            tag,
            startDate,
            endDate,
            status,
            subscriptionId,
            note,
        };
    });
}
