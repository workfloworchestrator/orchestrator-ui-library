import { useGetSurfSubscriptionDropdownOptionsQuery } from '@/rtk/endpoints/surfSubscriptionDropdownOptions';
import { SurfSubscriptionDropdownOptionsFilterParams } from '@/types';

export const useGetSurfSubscriptionDropdownOptions = (
    tags: string[] = [],
    statuses: string[] = ['active'],
    productIds: string[] = [],
    excludeSubscriptionIds: string[] = [],
    customerId?: string,
    portModes: string[] = [],
    bandwidth?: number,
) => {
    const filter_params: SurfSubscriptionDropdownOptionsFilterParams = {
        product_tags: tags,
        statuses,
        product_ids: productIds,
        exclude_subscription_ids: excludeSubscriptionIds,
        port_modes: portModes,
        bandwidth,
    };

    if (customerId) {
        filter_params.customer_ids = [customerId];
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
