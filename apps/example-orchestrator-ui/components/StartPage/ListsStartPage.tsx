import React, { ReactElement, useState } from 'react';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiPanel,
    EuiSpacer,
    EuiButton,
} from '@elastic/eui';
import { useQuery } from 'react-query';
import { ORCHESTRATOR_API_BASE_URL } from '../../constants';
import ListItemStartPage from './ListItemStartPage';

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

export default function ListsStartPage(): ReactElement {
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
            {favouriteSubscriptionsList && (
                <EuiFlexItem>
                    <EuiPanel
                        hasShadow={false}
                        hasBorder={true}
                        paddingSize="l"
                    >
                        <p style={{ fontWeight: 600 }}>
                            {' '}
                            {favouriteSubscriptionsList.title}{' '}
                        </p>
                        <EuiSpacer size="m" />
                        {favouriteSubscriptionsList.items.map((item, index) => (
                            <>
                                <ListItemStartPage
                                    item={item}
                                    type={favouriteSubscriptionsList.type}
                                />
                                {index ===
                                favouriteSubscriptionsList.items.length -
                                    1 ? null : (
                                    <EuiHorizontalRule margin="none" />
                                )}
                            </>
                        ))}
                        <EuiSpacer size="m" />
                        <EuiButton fullWidth={true}>
                            {favouriteSubscriptionsList.buttonName}
                        </EuiButton>
                    </EuiPanel>
                </EuiFlexItem>
            )}
            {processesAttentionList && (
                <EuiFlexItem>
                    <EuiPanel
                        hasShadow={false}
                        hasBorder={true}
                        paddingSize="l"
                    >
                        <p style={{ fontWeight: 600 }}>
                            {' '}
                            {processesAttentionList.title}{' '}
                        </p>
                        <EuiSpacer size="m" />
                        {processesAttentionList.items.map((item, index) => (
                            <>
                                <ListItemStartPage
                                    item={item}
                                    type={processesAttentionList.type}
                                />
                                {index ===
                                processesAttentionList.items.length -
                                    1 ? null : (
                                    <EuiHorizontalRule margin="none" />
                                )}
                            </>
                        ))}
                        <EuiSpacer size="m" />
                        <EuiButton fullWidth={true}>
                            {processesAttentionList.buttonName}
                        </EuiButton>
                    </EuiPanel>
                </EuiFlexItem>
            )}
            {completedProcessesList && (
                <EuiFlexItem>
                    <EuiPanel
                        hasShadow={false}
                        hasBorder={true}
                        paddingSize="l"
                    >
                        <p style={{ fontWeight: 600 }}>
                            {' '}
                            {completedProcessesList.title}{' '}
                        </p>
                        <EuiSpacer size="m" />
                        {completedProcessesList.items.map((item, index) => (
                            <>
                                <ListItemStartPage
                                    item={item}
                                    type={completedProcessesList.type}
                                />
                                {index ===
                                completedProcessesList.items.length -
                                    1 ? null : (
                                    <EuiHorizontalRule margin="none" />
                                )}
                            </>
                        ))}
                        <EuiSpacer size="m" />
                        <EuiButton fullWidth={true}>
                            {completedProcessesList.buttonName}
                        </EuiButton>
                    </EuiPanel>
                </EuiFlexItem>
            )}
        </EuiFlexGroup>
    );
}
