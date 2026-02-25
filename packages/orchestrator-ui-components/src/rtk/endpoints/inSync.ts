import { CacheTagType, Subscription } from '@/types';

import { BaseQueryTypes, orchestratorApi } from '../api';

const inSyncApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    setSubscriptionInSync: build.mutation<void, Subscription['subscriptionId']>({
      query: (subscriptionId) => ({
        url: `subscriptions/${subscriptionId}/set_in_sync`,
        method: 'PUT',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: (_result, _error, subscriptionId) => [
        {
          type: CacheTagType.subscriptions,
          id: subscriptionId,
        },
      ],
    }),
  }),
});

export const { useSetSubscriptionInSyncMutation } = inSyncApi;
