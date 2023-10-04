import { SubscriptionsResult, SubscriptionListItem } from '../../types';
import { parseDate } from '../../utils';

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
            subscriptionId,
            description,
            status,
            insync,
            startDate: parseDate(startDate),
            endDate: parseDate(endDate),
            note,
            productName,
            tag,
        };
    });
}
