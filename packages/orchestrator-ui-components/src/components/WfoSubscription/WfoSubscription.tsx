import React from 'react';

import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import {
    EuiBadgeGroup,
    EuiFlexGroup,
    EuiFlexItem,
    EuiText,
} from '@elastic/eui';

import { GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY } from '@/graphqlQueries';
import { useOrchestratorTheme, useQueryWithGraphql } from '@/hooks';

import { WfoSubscriptionStatusBadge } from '../WfoBadges';
import { WfoSubscriptionSyncStatusBadge } from '../WfoBadges/WfoSubscriptionSyncStatusBadge';
import { WfoError } from '../WfoError';
import { WfoFilterTabs } from '../WfoFilterTabs';
import { WfoLoading } from '../WfoLoading';
import { WfoProcessesTimeline } from './WfoProcessesTimeline';
import { WfoRelatedSubscriptions } from './WfoRelatedSubscriptions';
import { WfoSubscriptionActions } from './WfoSubscriptionActions';
import { WfoSubscriptionDetailTree } from './WfoSubscriptionDetailTree';
import { WfoSubscriptionGeneral } from './WfoSubscriptionGeneral';
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

    const { data, isLoading, isError } = useQueryWithGraphql(
        GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY,
        { subscriptionId },
        `subscription-${subscriptionId}`,
    );

    const onSelectedTabChanged = (tab: SubscriptionDetailTab) => {
        setActiveTab(tab);
    };

    const subscriptionResult =
        data && data.subscriptions && data.subscriptions.page;
    const subscriptionDetail = subscriptionResult
        ? subscriptionResult[0]
        : null;

    return (
        <>
            {(isError && <WfoError />) ||
                (isLoading && <WfoLoading />) ||
                (subscriptionDetail && (
                    <>
                        <EuiFlexGroup
                            style={{ marginBottom: 10 }}
                            justifyContent="spaceBetween"
                        >
                            <EuiFlexItem grow={true}>
                                <EuiText>
                                    <h2>{subscriptionDetail.description}</h2>
                                </EuiText>
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

                        {selectedTab === SubscriptionDetailTab.GENERAL_TAB && (
                            <WfoSubscriptionGeneral
                                subscriptionDetail={subscriptionDetail}
                            />
                        )}
                        {selectedTab ===
                            SubscriptionDetailTab.SERVICE_CONFIGURATION_TAB && (
                            <WfoSubscriptionDetailTree
                                productBlockInstances={
                                    subscriptionDetail.productBlockInstances
                                }
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
                ))}
        </>
    );
};
