import React, { FC } from 'react';

import { EuiFlexGroup } from '@elastic/eui';

import {
    useFavouriteSubscriptions,
    useProcessesAttention,
    useRecentProcesses,
} from '@/hooks';

import WfoListStartPage from './WfoListStartPage';

export const WfoMultiListSection: FC = () => {
    const favouriteSubscriptionsList = useFavouriteSubscriptions();
    const processesAttentionList = useProcessesAttention();
    const completedProcessesList = useRecentProcesses();

    return (
        <EuiFlexGroup wrap>
            <WfoListStartPage list={favouriteSubscriptionsList} />
            <WfoListStartPage list={processesAttentionList} />
            <WfoListStartPage list={completedProcessesList} />
        </EuiFlexGroup>
    );
};
