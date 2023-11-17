import React, { FC } from 'react';

import { EuiFlexGroup } from '@elastic/eui';

import WfoListStartPage from './WfoListStartPage';
import {
    useFavouriteSubscriptions,
    useProcessesAttention,
    useRecentProcesses,
} from '../../hooks/DataFetchHooks';

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
