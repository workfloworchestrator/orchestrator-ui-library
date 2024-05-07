import { SUBSCRIPTION_ACTIONS_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, CacheTags, orchestratorApi } from '@/rtk';
import { SubscriptionActions } from '@/types';

const subscriptionActionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getSubscriptionActions: build.query<
            SubscriptionActions,
            { subscriptionId: string }
        >({
            query: ({ subscriptionId }) =>
                `${SUBSCRIPTION_ACTIONS_ENDPOINT}/${subscriptionId}`,
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
            providesTags: [CacheTags.subscriptionActions],
        }),
    }),
});

export const { useGetSubscriptionActionsQuery } = subscriptionActionsApi;
