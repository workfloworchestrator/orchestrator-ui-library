import { useGetSurfSubscriptionDropdownOptionsQuery } from '@/rtk/endpoints/surfSubscriptionDropdownOptions';
import {
    FilterParams,
    GraphqlFilter,
    SubscriptionDropdownOption,
} from '@/types';

export const useGetSurfSubscriptionDropdownOptions = (
    tags: string[] = [],
    statuses: string[] = ['active'],
    productIds: string[] = [],
    // TODO other filters
) => {
    const filter_params: FilterParams = {};

    if (tags) {
        filter_params.product_tags = tags;
    }
    if (statuses) {
        filter_params.statuses = statuses;
    }
    if (productIds) {
        filter_params.product_ids = productIds;
    }

    const { data, isFetching, refetch, isError } =
        useGetSurfSubscriptionDropdownOptionsQuery({ params: filter_params });

    const options = (() => {
        if (!isFetching && !isError && data) {
            return data;
        }
        return [];
    })();

    return { isFetching, refetch, options };
};
