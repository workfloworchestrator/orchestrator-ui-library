import React, { FC } from 'react';
import { EuiFlexGroup } from '@elastic/eui';
import ListStartPage from './ListStartPage';
import {
    useFavouriteSubscriptions,
    useProcessesAttention,
    useRecentProcesses,
} from '../../hooks/DataFetchHooks';

export const MultiListSection: FC = () => {
    const favouriteSubscriptionsList = useFavouriteSubscriptions();
    const processesAttentionList = useProcessesAttention();
    const completedProcessesList = useRecentProcesses();

    return (
        <EuiFlexGroup wrap>
            <ListStartPage list={favouriteSubscriptionsList} />
            <ListStartPage list={processesAttentionList} />
            <ListStartPage list={completedProcessesList} />
        </EuiFlexGroup>
    );
};
