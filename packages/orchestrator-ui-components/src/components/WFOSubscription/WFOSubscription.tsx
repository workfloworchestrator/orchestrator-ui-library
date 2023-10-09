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
import { WFOSubscriptionActions } from './WFOSubscriptionActions';
import { WFOSubscriptionGeneral } from './WFOSubscriptionGeneral';
import { WFOSubscriptionDetailTree } from './WFOSubscriptionDetailTree';
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

    // Todo #97: Find out if pre fetch can be used again. The shape of table cache seems to have changed
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
                                <WFOSubscriptionActions
                                    subscriptionId={subscriptionId}
                                />
                            </EuiFlexItem>
                        </EuiFlexGroup>
                        <>
                            <EuiTabs>{renderTabs()}</EuiTabs>
                        </>

                        {selectedTabId === SubscriptionTabIds.GENERAL_TAB && (
                            <WFOSubscriptionGeneral
                                subscriptionDetail={subscriptionDetail}
                            />
                        )}
                        {selectedTabId ===
                            SubscriptionTabIds.SERVICE_CONFIGURATION_TAB && (
                            <WFOSubscriptionDetailTree
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
