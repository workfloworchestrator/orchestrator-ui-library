import { GraphqlFilter, Subscription } from '../../types';
import { useQueryWithGraphql } from '../useQueryWithGraphql';
import { getSubscriptionsListGraphQlQuery } from '../../graphqlQueries';

export const useGetSubscriptions = (
    tags: string[] = [],
    statuses: string[] = [],
    setSubscriptions: (subscriptions: Subscription[]) => void,
) => {
    // The way the graphql filterBy clause on the backend handled multiple AND values is by joining them with -
    const tagValue = tags.join('-');
    const statusValue = statuses.join('-');

    const filters: GraphqlFilter<Subscription>[] = [];

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
        getSubscriptionsListGraphQlQuery<Subscription>(),
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
