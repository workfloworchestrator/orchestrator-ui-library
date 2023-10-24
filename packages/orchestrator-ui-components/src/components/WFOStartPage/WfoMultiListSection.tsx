import React, { FC } from 'react';
import { EuiFlexGroup } from '@elastic/eui';
import WFOListStartPage from './WFOListStartPage';
import {
    useFavouriteSubscriptions,
    useProcessesAttention,
    useRecentProcesses,
} from '../../hooks/DataFetchHooks';

export const WFOMultiListSection: FC = () => {
    const favouriteSubscriptionsList = useFavouriteSubscriptions();
    const processesAttentionList = useProcessesAttention();
    const completedProcessesList = useRecentProcesses();

    return (
        <EuiFlexGroup wrap>
            <WFOListStartPage list={favouriteSubscriptionsList} />
            <WFOListStartPage list={processesAttentionList} />
            <WFOListStartPage list={completedProcessesList} />
        </EuiFlexGroup>
    );
};
