import { GraphqlFilter, SubscriptionDropdownOption } from '../../types';
import { useQueryWithGraphql } from '../useQueryWithGraphql';
import { getSubscriptionDropdownOptionsGraphQlQuery } from '../../graphqlQueries';
import { isError } from 'react-query';

export const useGetSubscriptionDropdownOptions = (
    tags: string[] = [],
    statuses: string[] = [],
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

    const { data, isFetching, refetch } = useQueryWithGraphql(
        getSubscriptionDropdownOptionsGraphQlQuery(),
        {
            filterBy: filters,
        },
        'subscriptionOptions',
    );

    const subscriptions = (() => {
        if (!isFetching && !isError(data) && data && data.subscriptions.page) {
            return data.subscriptions.page;
        }
        return [];
    })();

    return { isFetching, refetch, subscriptions };
};
