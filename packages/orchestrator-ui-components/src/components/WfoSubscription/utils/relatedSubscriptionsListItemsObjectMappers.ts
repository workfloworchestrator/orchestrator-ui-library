import { RelatedSubscriptionListItem } from '@/components';
import { RelatedSubscriptionsResponse } from '@/rtk';
import { GraphQLSort, GraphqlFilter, RelatedSubscription } from '@/types';
import { parseDate } from '@/utils';

export const mapRelatedSubscriptionsResponseToRelatedSubscriptionsListItems = (
    input?: RelatedSubscriptionsResponse,
): RelatedSubscriptionListItem[] =>
    input?.relatedSubscriptions.map(
        ({
            subscriptionId,
            description,
            status,
            insync,
            customer,
            product,
            startDate,
        }) => ({
            subscriptionId,
            description,
            status,
            insync,
            customerFullname: customer.fullname,
            tag: product.tag,
            startDate: parseDate(startDate),
        }),
    ) ?? [];

// Some fields are not a key of Process, however backend still supports them
// Backend concatenates object name with the key, e.g. product.name becomes productName
// Todo: typecast is needed until ticket is implemented:
// https://github.com/workfloworchestrator/orchestrator-ui/issues/290
const relatedSubscriptionsFieldMapper = (
    field: keyof RelatedSubscriptionListItem,
): keyof RelatedSubscription => {
    switch (field) {
        case 'customerFullname':
            return 'customer' as keyof RelatedSubscription;
        case 'tag':
            return 'product' as keyof RelatedSubscription;
        default:
            return field;
    }
};

export const graphQlRelatedSubscriptionsSortMapper = ({
    field,
    order,
}: GraphQLSort<RelatedSubscriptionListItem>): GraphQLSort<RelatedSubscription> => ({
    field: relatedSubscriptionsFieldMapper(field),
    order,
});

export const graphQlRelatedSubscriptionsTerminatedSubscriptionsFilterMapper = (
    data?: GraphqlFilter<RelatedSubscriptionListItem>,
): GraphqlFilter<RelatedSubscription> | undefined =>
    data
        ? {
              field: relatedSubscriptionsFieldMapper(data?.field),
              value: data?.value,
          }
        : undefined;
