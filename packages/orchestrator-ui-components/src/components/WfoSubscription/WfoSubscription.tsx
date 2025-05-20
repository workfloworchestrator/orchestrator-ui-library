import React from 'react';

import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import {
    WfoFilterTabs,
    WfoLoading,
    WfoProcessesTimeline,
    WfoRelatedSubscriptions,
    WfoSubscriptionActions,
    WfoSubscriptionDetailTree,
    WfoSubscriptionGeneral,
} from '@/components';
import {
    WfoSubscriptionStatusBadge,
    WfoSubscriptionSyncStatusBadge,
    WfoTitleWithWebsocketBadge,
} from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { useGetSubscriptionDetailQuery } from '@/rtk/endpoints/subscriptionDetail';

import { WfoError } from '../WfoError';
import { subscriptionDetailTabs } from './subscriptionDetailTabs';
import { SubscriptionDetailTab } from './utils';

type WfoSubscriptionProps = {
    subscriptionId: string;
};

export const WfoSubscription = ({ subscriptionId }: WfoSubscriptionProps) => {
    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(
            StringParam,
            SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
        ),
    );

    const selectedTab = ((): SubscriptionDetailTab => {
        return (
            subscriptionDetailTabs.find(({ id }) => id === activeTab)?.id ||
            SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB
        );
    })();

    const { data, isLoading, isError } = useGetSubscriptionDetailQuery({
        subscriptionId,
    });

    const onSelectedTabChanged = (tab: SubscriptionDetailTab) => {
        setActiveTab(tab);
    };
    const subscriptionDetail = data?.subscription;

    return (
        <>
            {(isError && <WfoError />) ||
                (isLoading && <WfoLoading />) ||
                (subscriptionDetail && subscriptionDetail.subscriptionId && (
                    <>
                        <WfoContentHeader
                            title={
                                <WfoTitleWithWebsocketBadge
                                    title={subscriptionDetail.description}
                                />
                            }
                            subtitle={
                                <>
                                    <WfoSubscriptionStatusBadge
                                        status={subscriptionDetail.status}
                                    />
                                    <WfoSubscriptionSyncStatusBadge
                                        insync={subscriptionDetail.insync}
                                    />
                                </>
                            }
                        >
                            <WfoSubscriptionActions
                                subscriptionId={subscriptionId}
                            />
                        </WfoContentHeader>

                        <WfoFilterTabs
                            tabs={subscriptionDetailTabs}
                            selectedTab={selectedTab}
                            translationNamespace="subscriptions.detail.tabs"
                            onChangeTab={onSelectedTabChanged}
                        />

                        {selectedTab ===
                            SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB && (
                            <WfoSubscriptionDetailTree
                                productBlockInstances={
                                    subscriptionDetail.productBlockInstances
                                }
                                subscriptionId={subscriptionId}
                            />
                        )}
                        {selectedTab === SubscriptionDetailTab.GENERAL_TAB && (
                            <WfoSubscriptionGeneral
                                subscriptionDetail={subscriptionDetail}
                            />
                        )}
                        {selectedTab === SubscriptionDetailTab.PROCESSES_TAB &&
                            data &&
                            subscriptionDetail.processes?.page && (
                                <WfoProcessesTimeline
                                    subscriptionDetailProcesses={
                                        subscriptionDetail.processes?.page
                                    }
                                />
                            )}
                        {selectedTab ===
                            SubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB &&
                            data && (
                                <WfoRelatedSubscriptions
                                    subscriptionId={
                                        subscriptionDetail.subscriptionId
                                    }
                                />
                            )}
                    </>
                )) || <h1>Unknown subscriptionId: {subscriptionId}</h1>}
        </>
    );
};
