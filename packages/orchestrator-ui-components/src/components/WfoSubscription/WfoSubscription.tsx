import React, { useState } from 'react';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiTab,
    EuiTabs,
    EuiText,
    EuiIcon,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { SubscriptionTabIds } from './utils';
import { WfoProcessesTimeline } from './WfoProcessesTimeline';
import { WfoRelatedSubscriptions } from './WfoRelatedSubscriptions';
import { WfoSubscriptionActions } from './WfoSubscriptionActions';
import { WfoSubscriptionDetailTree } from './WfoSubscriptionDetailTree';
import { WfoSubscriptionGeneral } from './WfoSubscriptionGeneral';
import { GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { useQueryWithGraphql } from '../../hooks';
import { WfoLoading } from '../WfoLoading';

type WfoSubscriptionProps = {
    subscriptionId: string;
};

const tabs = [
    {
        id: SubscriptionTabIds.GENERAL_TAB,
        translationKey: 'tabs.general',
        prepend: <EuiIcon type="devToolsApp" />,
        append: <></>,
    },
    {
        id: SubscriptionTabIds.SERVICE_CONFIGURATION_TAB,
        translationKey: 'tabs.serviceConfiguration',
        prepend: <EuiIcon type="submodule" />,
    },
    {
        id: SubscriptionTabIds.PROCESSES_TAB,
        translationKey: 'tabs.processes',
        prepend: <EuiIcon type="indexRuntime" />,
    },
    {
        id: SubscriptionTabIds.RELATED_SUBSCRIPTIONS_TAB,
        translationKey: 'tabs.relatedSubscriptions',
        prepend: <EuiIcon type="heatmap" />,
    },
];

export const WfoSubscription = ({ subscriptionId }: WfoSubscriptionProps) => {
    const t = useTranslations('subscriptions.detail');
    const [selectedTabId, setSelectedTabId] = useState<SubscriptionTabIds>(
        SubscriptionTabIds.GENERAL_TAB,
    );

    const { data, isFetching } = useQueryWithGraphql(
        GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY,
        { subscriptionId },
        `subscription-${subscriptionId}`,
    );

    const onSelectedTabChanged = (id: SubscriptionTabIds) => {
        setSelectedTabId(id);
    };

    const renderTabs = () =>
        tabs.map((tab, index) => (
            <EuiTab
                key={index}
                onClick={() => onSelectedTabChanged(tab.id)}
                isSelected={tab.id === selectedTabId}
                prepend={tab.prepend}
                append={tab.append}
            >
                {t(tab.translationKey)}
            </EuiTab>
        ));

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
                        <>
                            <EuiTabs>{renderTabs()}</EuiTabs>
                        </>

                        {selectedTabId === SubscriptionTabIds.GENERAL_TAB && (
                            <WfoSubscriptionGeneral
                                subscriptionDetail={subscriptionDetail}
                            />
                        )}
                        {selectedTabId ===
                            SubscriptionTabIds.SERVICE_CONFIGURATION_TAB && (
                            <WfoSubscriptionDetailTree
                                productBlockInstances={
                                    subscriptionDetail.productBlockInstances
                                }
                            />
                        )}
                        {selectedTabId === SubscriptionTabIds.PROCESSES_TAB &&
                            data && (
                                <WfoProcessesTimeline
                                    subscriptionDetailProcesses={
                                        subscriptionDetail.processes.page
                                    }
                                />
                            )}
                        {selectedTabId ===
                            SubscriptionTabIds.RELATED_SUBSCRIPTIONS_TAB &&
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
