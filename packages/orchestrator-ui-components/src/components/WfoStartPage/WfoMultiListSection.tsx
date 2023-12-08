import React, { FC } from 'react';
import { useQueryClient } from 'react-query';

import { EuiButton, EuiFlexGroup } from '@elastic/eui';

import { WfoJsonCodeBlock } from '@/components/WfoJsonCodeBlock/WfoJsonCodeBlock';
import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import { getSubscriptionsListGraphQlQueryForStartPage } from '@/graphqlQueries';
import {
    useFavouriteSubscriptions,
    useProcessesAttention,
    useQueryWithGraphql,
    useRecentProcesses,
} from '@/hooks';

import WfoListStartPage from './WfoListStartPage';

export const WfoMultiListSection: FC = () => {
    const queryClient = useQueryClient();

    const favouriteSubscriptionsList = useFavouriteSubscriptions();
    const processesAttentionList = useProcessesAttention();
    const completedProcessesList = useRecentProcesses();

    const { data, status } = useQueryWithGraphql(
        getSubscriptionsListGraphQlQueryForStartPage<SubscriptionListItem>(),
        {
            first: 5,
            after: 0,
            filterBy: [{ field: 'status', value: 'ACTIVE' }],
        },
        'subscriptions',
        false,
        true,
        ['startPage'],
    );

    return (
        <EuiFlexGroup wrap>
            <div>
                <EuiButton
                    onClick={() =>
                        queryClient.invalidateQueries(['subscriptions'])
                    }
                >
                    Invalidate subscriptions cache-key
                </EuiButton>
            </div>

            <div>
                <EuiButton
                    onClick={() =>
                        queryClient.invalidateQueries([
                            'subscriptions',
                            'startPage',
                        ])
                    }
                >
                    Invalidate startPage cache-key
                </EuiButton>
                <EuiButton
                    onClick={() =>
                        queryClient.invalidateQueries([
                            'subscriptions',
                            'listPage',
                        ])
                    }
                >
                    Invalidate listPage cache-key
                </EuiButton>
            </div>

            <div>Status: {status}</div>
            <WfoJsonCodeBlock data={data ?? {}} />
            <WfoListStartPage list={favouriteSubscriptionsList} />
            <WfoListStartPage list={processesAttentionList} />
            <WfoListStartPage list={completedProcessesList} />
        </EuiFlexGroup>
    );
};
