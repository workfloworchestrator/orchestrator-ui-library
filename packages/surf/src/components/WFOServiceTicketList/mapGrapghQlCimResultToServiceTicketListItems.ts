import {
    parseDate,
    Subscription,
    SubscriptionsResult,
} from '@orchestrator-ui/orchestrator-ui-components';

export type SubscriptionListItem = Pick<
    Subscription,
    'subscriptionId' | 'description' | 'status' | 'insync' | 'note'
> & {
    startDate: Date | null;
    endDate: Date | null;
    productName: string;
    tag: string | null;
};

export function mapGrapghQlCimResultToServiceTicketListItems(
    graphqlResponse: SubscriptionsResult,
): SubscriptionListItem[] {
    return graphqlResponse.subscriptions.page.map(
        (subscription: Subscription) => {
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
        },
    );
}
