import React, { ReactElement, useState } from 'react';
import { EuiFlexGroup } from '@elastic/eui';
import { useQuery } from 'react-query';
import { ORCHESTRATOR_API_BASE_URL } from '../../constants';
import ListStartPage from './ListStartPage';

export interface ItemsList {
    type: string;
    title: string;
    items: object[];
    buttonName: string;
}

async function getFavouriteSubscriptions() {
    const response = await fetch(
        ORCHESTRATOR_API_BASE_URL + '/api/subscriptions/?range=10%2C15',
    );
    return await response.json();
}

async function getProcessesNeedingAttention() {
    const response = await fetch(
        ORCHESTRATOR_API_BASE_URL + '/api/processes/?range=100%2C105',
    );
    return await response.json();
}

async function getRecentProcesses() {
    const response = await fetch(
        ORCHESTRATOR_API_BASE_URL + '/api/processes/?range=106%2C111',
    );
    return await response.json();
}

export default function ListsRowStartPage(): ReactElement {
    const [favouriteSubscriptionsList, setFavouriteSubscriptionsList] =
        useState<ItemsList>();
    const [processesAttentionList, setProcessesAttentionList] =
        useState<ItemsList>();
    const [completedProcessesList, setCompletedProcessesList] =
        useState<ItemsList>();

    useQuery(['favouriteSubscriptions'], () => getFavouriteSubscriptions(), {
        onSuccess: (data) => {
            setFavouriteSubscriptionsList({
                type: 'subscription',
                title: 'Favourite Subscriptions',
                items: data,
                buttonName: 'Show all favourites',
            });
        },
    });
    useQuery(['processesAttention'], () => getProcessesNeedingAttention(), {
        onSuccess: (data) => {
            setProcessesAttentionList({
                type: 'process',
                title: 'Processes that need attention',
                items: data,
                buttonName: 'Show all active processes',
            });
        },
    });
    useQuery(['recentProcesses'], () => getRecentProcesses(), {
        onSuccess: (data) => {
            setCompletedProcessesList({
                type: 'process',
                title: 'Recently completed processes',
                items: data,
                buttonName: 'Show all completed processes',
            });
        },
    });

    return (
        <EuiFlexGroup>
            <ListStartPage list={favouriteSubscriptionsList} />
            <ListStartPage list={processesAttentionList} />
            <ListStartPage list={completedProcessesList} />
        </EuiFlexGroup>
    );
}
