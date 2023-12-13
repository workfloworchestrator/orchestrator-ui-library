import { Subscription, SubscriptionsResult } from '../../types';
import { parseDate } from '../../utils';

export type SubscriptionListItem = Pick<
    Subscription,
    'subscriptionId' | 'description' | 'status' | 'insync' | 'note'
> & {
    startDate: Date | null;
    endDate: Date | null;
    productName: string;
    tag: string | null;
    customerFullname: string;
    customerShortcode: string;
};

export function mapGraphQlSubscriptionsResultToSubscriptionListItems(
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
            customer,
        } = subscription;

        const { name: productName, tag } = product;
        const { fullname: customerFullname, shortcode: customerShortcode } =
            customer;

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
            customerFullname,
            customerShortcode,
        };
    });
}
