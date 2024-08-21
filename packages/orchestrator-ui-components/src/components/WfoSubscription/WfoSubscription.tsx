import React from 'react';

import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import {
    EuiBadgeGroup,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
} from '@elastic/eui';

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
import { useOrchestratorTheme } from '@/hooks';
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

    const { multiplyByBaseUnit } = useOrchestratorTheme();

    const selectedTab = ((): SubscriptionDetailTab => {
        return (
            subscriptionDetailTabs.find(({ id }) => id === activeTab)?.id ||
            SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB
        );
    })();

    const { data, isLoading, isError, isFetching } =
        useGetSubscriptionDetailQuery({
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
                        <EuiFlexGroup
                            style={{ marginBottom: 10 }}
                            justifyContent="spaceBetween"
                        >
                            <EuiFlexItem grow={true}>
                                <WfoTitleWithWebsocketBadge
                                    title={subscriptionDetail.description}
                                />
                                <EuiSpacer size="xs" />
                                <EuiBadgeGroup
                                    css={{ marginRight: multiplyByBaseUnit(1) }}
                                >
                                    <EuiFlexItem grow={false}>
                                        <WfoSubscriptionStatusBadge
                                            status={subscriptionDetail.status}
                                        />
                                    </EuiFlexItem>
                                    <EuiFlexItem grow={false}>
                                        <WfoSubscriptionSyncStatusBadge
                                            insync={subscriptionDetail.insync}
                                        />
                                    </EuiFlexItem>
                                </EuiBadgeGroup>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <WfoSubscriptionActions
                                    subscriptionId={subscriptionId}
                                />
                            </EuiFlexItem>
                        </EuiFlexGroup>

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
                                isFetching={isFetching}
                            />
                        )}
                        {selectedTab === SubscriptionDetailTab.PROCESSES_TAB &&
                            data && (
                                <WfoProcessesTimeline
                                    subscriptionDetailProcesses={
                                        subscriptionDetail.processes.page
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
