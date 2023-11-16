import { GraphqlFilter, SubscriptionDropdownOption } from '../../types';
import { useQueryWithGraphql } from '../useQueryWithGraphql';
import { getSubscriptionDropdownOptionsGraphQlQuery } from '../../graphqlQueries';

export const useGetSubscriptionDropdownOptions = (
    tags: string[] = [],
    statuses: string[] = [],
    setSubscriptions: (subscriptions: SubscriptionDropdownOption[]) => void,
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

    const { data, isFetching, isFetched, refetch } = useQueryWithGraphql(
        getSubscriptionDropdownOptionsGraphQlQuery(),
        {
            first: 1000,
            after: 0,
            filterBy: filters,
        },
        'subscriptionField',
    );

    if (isFetched && data && data.subscriptions.page) {
        setSubscriptions(data.subscriptions.page);
    }

    return { isFetching, refetch };
};
