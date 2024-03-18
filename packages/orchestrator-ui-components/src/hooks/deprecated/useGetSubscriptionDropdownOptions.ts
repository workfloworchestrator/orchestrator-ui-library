import { isError } from 'react-query';

import { useGetSubscriptionsDropdownOptionsQuery } from '@/rtk';
import { GraphqlFilter, SubscriptionDropdownOption } from '@/types';

export const useGetSubscriptionDropdownOptions = (
    tags: string[] = [],
    statuses: string[] = ['active'],
) => {
    // The way the graphql filterBy clause on the backend handled multiple AND values is by joining them with -
    const tagValue = tags.join('-');
    const statusValue = statuses.join('-');

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

    const { data, isFetching, refetch } =
        useGetSubscriptionsDropdownOptionsQuery({ filterBy: filters });

    const subscriptions = (() => {
        if (!isFetching && !isError(data) && data) {
            return data.subscriptionDropdownOptions;
        }
        return [];
    })();

    return { isFetching, refetch, subscriptions };
};
