import { useGetSubscriptionsDropdownOptionsQuery } from '@/rtk';
import { GraphqlFilter, SubscriptionDropdownOption } from '@/types';

export const useGetSubscriptionDropdownOptions = (
    tags: string[] = [],
    statuses: string[] = ['active'],
) => {
    // TODO remove

    // The way the graphql filterBy clause on the backend handled multiple AND values is by joining them with |
    const tagValue = tags.join('|');
    const statusValue = statuses.join('|');

    const filters: GraphqlFilter<SubscriptionDropdownOption>[] = [];

    if (tagValue) {
        filters.push({
            field: 'tag',
            value: tagValue,
        });
    }

    if (statusValue) {
        filters.push({
            field: 'status',
            value: statusValue,
        });
    }

    const { data, isFetching, refetch, isError } =
        useGetSubscriptionsDropdownOptionsQuery({ filterBy: filters });

    const subscriptions = (() => {
        if (!isFetching && !isError && data) {
            return data.subscriptionDropdownOptions;
        }
        return [];
    })();

    return { isFetching, refetch, subscriptions };
};
