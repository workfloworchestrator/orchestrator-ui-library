import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';
import { useQueryWithGraphql } from '../../hooks';

import { SubscriptionTabIds, tabs } from './utils';

import { GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { WFOLoading } from '../WFOLoading';
import { SubscriptionActions } from './SubscriptionActions';
import { SubscriptionGeneral } from './SubscriptionGeneral';
import { SubscriptionDetailTree } from './SubscriptionDetailTree';
import { ProcessesTimeline } from './WFOProcessesTimeline';

type WFOSubscriptionProps = {
    subscriptionId: string;
};

export const WFOSubscription = ({ subscriptionId }: WFOSubscriptionProps) => {
    const t = useTranslations('subscriptions.detail');
    const [selectedTabId, setSelectedTabId] = useState<SubscriptionTabIds>(
        SubscriptionTabIds.GENERAL_TAB,
    );

    const { data, isFetching } = useQueryWithGraphql(
        GET_SUBSCRIPTION_DETAIL_GRAPHQL_QUERY,
        { subscriptionId },
        `subscription-${subscriptionId}`,
        true,
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
                disabled={tab.disabled}
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
            {(isFetching && <WFOLoading />) ||
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
                                <SubscriptionActions
                                    subscriptionId={subscriptionId}
                                />
                            </EuiFlexItem>
                        </EuiFlexGroup>
                        <>
                            <EuiTabs>{renderTabs()}</EuiTabs>
                        </>

                        {selectedTabId === SubscriptionTabIds.GENERAL_TAB && (
                            <SubscriptionGeneral
                                subscriptionDetail={subscriptionDetail}
                            />
                        )}
                        {selectedTabId ===
                            SubscriptionTabIds.SERVICE_CONFIGURATION_TAB && (
                            <SubscriptionDetailTree
                                productBlockInstances={
                                    subscriptionDetail.productBlockInstances
                                }
                            />
                        )}
                        {selectedTabId === SubscriptionTabIds.PROCESSES_TAB &&
                            data && (
                                <ProcessesTimeline
                                    subscriptionId={subscriptionId}
                                />
                            )}
                    </>
                ))}
        </>
    );
};
