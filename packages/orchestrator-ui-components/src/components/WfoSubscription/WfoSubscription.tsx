import React from 'react';

import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY } from '@/graphqlQueries';
import { useQueryWithGraphql } from '@/hooks';

import { WfoFilterTabs } from '../WfoFilterTabs';
import { WfoLoading } from '../WfoLoading';
import { WfoProcessesTimeline } from './WfoProcessesTimeline';
import { WfoRelatedSubscriptions } from './WfoRelatedSubscriptions';
import { WfoSubscriptionActions } from './WfoSubscriptionActions';
import { WfoSubscriptionDetailTree } from './WfoSubscriptionDetailTree';
import { WfoSubscriptionGeneral } from './WfoSubscriptionGeneral';
import { subscriptionDetailTabs } from './subscriptionDetailTabs';
import { WfoSubscriptionDetailTab } from './utils';

type WfoSubscriptionProps = {
    subscriptionId: string;
};

export const WfoSubscription = ({ subscriptionId }: WfoSubscriptionProps) => {
    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoSubscriptionDetailTab.GENERAL_TAB),
    );

    const selectedTab = ((): WfoSubscriptionDetailTab => {
        return (
            subscriptionDetailTabs.find(({ id }) => id === activeTab)?.id ||
            WfoSubscriptionDetailTab.GENERAL_TAB
        );
    })();

    const { data, isFetching } = useQueryWithGraphql(
        GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY,
        { subscriptionId },
        `subscription-${subscriptionId}`,
    );

    const onSelectedTabChanged = (tab: WfoSubscriptionDetailTab) => {
        setActiveTab(tab);
    };

    const subscriptionResult =
        data && data.subscriptions && data.subscriptions.page;
    const subscriptionDetail = subscriptionResult
        ? subscriptionResult[0]
        : null;

    return (
        <>
            {(isFetching && <WfoLoading />) ||
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
                            WfoSubscriptionDetailTab.GENERAL_TAB && (
                            <WfoSubscriptionGeneral
                                subscriptionDetail={subscriptionDetail}
                            />
                        )}
                        {selectedTab ===
                            WfoSubscriptionDetailTab.SERVICE_CONFIGURATION_TAB && (
                            <WfoSubscriptionDetailTree
                                productBlockInstances={
                                    subscriptionDetail.productBlockInstances
                                }
                            />
                        )}
                        {selectedTab ===
                            WfoSubscriptionDetailTab.PROCESSES_TAB &&
                            data && (
                                <WfoProcessesTimeline
                                    subscriptionDetailProcesses={
                                        subscriptionDetail.processes.page
                                    }
                                />
                            )}
                        {selectedTab ===
                            WfoSubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB &&
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
