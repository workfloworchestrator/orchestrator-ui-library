import React, { FC, useState } from 'react';
import {
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';
import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { useTranslations } from 'next-intl';

import { GRAPHQL_ENDPOINT_CORE } from '../../constants';
import {
    GET_SUBSCRIPTION_DETAIL_COMPLETE,
    GET_SUBSCRIPTION_DETAIL_OUTLINE,
    mapApiResponseToSubscriptionDetail,
} from './subscriptionQuery';
import {
    GENERAL_TAB,
    getColor,
    PROCESSES_TAB,
    SERVICE_CONFIGURATION_TAB,
    tabs,
    SubscriptionContext,
    ProcessesTimeline,
    WFOSubscriptionActions,
    WFOSubscriptionDetailTree,
    WFOSubscriptionGeneral,
} from '@orchestrator-ui/orchestrator-ui-components';

type SubscriptionProps = {
    subscriptionId: string;
};

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT_CORE);

export const Subscription: FC<SubscriptionProps> = ({ subscriptionId }) => {
    const t = useTranslations('subscriptions.detail');
    const { subscriptionData, setSubscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext);

    const [selectedTabId, setSelectedTabId] = useState(GENERAL_TAB);

    const onSelectedTabChanged = (id: string) => {
        setSelectedTabId(id);
    };

    // Todo #97: Find out if pre fetch can be used again. The shape of table cache seems to have changed
    // const queryClient = useQueryClient();
    // const prefetchedData = {
    //     subscription: queryClient
    //         .getQueryData<SubscriptionListQuery>('subscriptions')
    //         ?.subscriptions.edges.find(
    //             (d) => d.node.subscriptionId == subscriptionId,
    //         ).node,
    // };

    const fetchSubscriptionOutline = async () => {
        console.log('Fetch outline query results for ID: ', subscriptionId);
        return graphQLClient.request(GET_SUBSCRIPTION_DETAIL_OUTLINE, {
            id: subscriptionId,
        });
    };
    const fetchSubscriptionComplete = async () => {
        console.log('Fetch complete query results for ID: ', subscriptionId);
        return graphQLClient.request(GET_SUBSCRIPTION_DETAIL_COMPLETE, {
            id: subscriptionId,
        });
    };

    const { isLoading, data } = useQuery(
        ['subscription-outline', subscriptionId],
        fetchSubscriptionOutline,
        {
            onSuccess: (data) =>
                setSubscriptionData(
                    mapApiResponseToSubscriptionDetail(data, false),
                    1,
                ),
        },
    );
    const { data: dataComplete } = useQuery(
        ['subscription-complete', subscriptionId],
        fetchSubscriptionComplete,
        {
            onSuccess: (data) =>
                setSubscriptionData(
                    mapApiResponseToSubscriptionDetail(data, true),
                    2,
                ),
        },
    );

    if (dataComplete && subscriptionData.subscriptionId === '') {
        console.log('No data in context populating dataComplete from cache');
        setSubscriptionData(
            mapApiResponseToSubscriptionDetail(dataComplete, true),
            2,
        );
    } else if (
        !dataComplete &&
        data &&
        subscriptionData.subscriptionId === ''
    ) {
        console.log('No data in context populating dataOutline from cache');
        setSubscriptionData(mapApiResponseToSubscriptionDetail(data, false), 1);
    }

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

    return (
        <>
            <EuiFlexGroup
                style={{ marginBottom: 10 }}
                justifyContent="spaceBetween"
            >
                <EuiFlexItem grow={true}>
                    <EuiText>
                        <h2>
                            {isLoading
                                ? ''
                                : data?.subscriptions.page[0].description}
                        </h2>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem style={{ width: 140 }}>
                            <span style={{ marginTop: 5 }}>
                                {t('loadingStatus')}
                                <EuiBadge
                                    style={{ marginLeft: 4 }}
                                    color={getColor(loadingStatus)}
                                >
                                    {loadingStatus}
                                </EuiBadge>
                            </span>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <WFOSubscriptionActions
                                subscriptionId={subscriptionId}
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
            <>
                <EuiTabs>{renderTabs()}</EuiTabs>
            </>

            {selectedTabId === GENERAL_TAB && <WFOSubscriptionGeneral />}
            {selectedTabId === SERVICE_CONFIGURATION_TAB && (
                <WFOSubscriptionDetailTree />
            )}
            {selectedTabId === PROCESSES_TAB && data && (
                <ProcessesTimeline subscriptionId={subscriptionId} />
            )}
        </>
    );
};
