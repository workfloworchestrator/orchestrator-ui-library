import { SUBSCRIPTION_ACTIONS_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { CacheTagType, SubscriptionActions } from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

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
            providesTags: (result, error, queryArguments) => {
                if (!error && result) {
                    return getCacheTag(
                        CacheTagType.subscriptions,
                        queryArguments.subscriptionId,
                    );
                }
                return [];
            },
        }),
    }),
});

export const {
    useGetSubscriptionActionsQuery,
    useLazyGetSubscriptionActionsQuery,
} = subscriptionActionsApi;
