import React, { FC, useMemo, useState } from 'react';
import {
    ProcessesTimeline,
    SubscriptionActions,
    SubscriptionDetailTree,
    SubscriptionGeneral,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';
import { useQuery } from 'react-query';
import { GRAPHQL_ENDPOINT_PYTHIA } from '../../constants';
import { GraphQLClient } from 'graphql-request';
import {
    GET_SUBSCRIPTION_DETAIL_COMPLETE,
    GET_SUBSCRIPTION_DETAIL_OUTLINE,
    mapApiResponseToSubscriptionDetail,
} from './subscriptionQuery';
import { SubscriptionContext } from '@orchestrator-ui/orchestrator-ui-components';
import {
    GENERAL_TAB,
    getColor,
    PROCESSES_TAB,
    SERVICE_CONFIGURATION_TAB,
    tabs,
} from './utils';

type SubscriptionProps = {
    subscriptionId: string;
};

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT_PYTHIA);

export const Subscription: FC<SubscriptionProps> = ({ subscriptionId }) => {
    const { subscriptionData, setSubscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext);

    const [selectedTabId, setSelectedTabId] = useState(GENERAL_TAB);
    const selectedTabContent = useMemo(() => {
        // @ts-ignore
        return tabs.find((obj) => obj.id === selectedTabId)?.content;
    }, [selectedTabId]);
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

    const renderTabs = () => {
        return tabs.map((tab, index) => (
            <EuiTab
                key={index}
                onClick={() => onSelectedTabChanged(tab.id)}
                isSelected={tab.id === selectedTabId}
                disabled={tab.disabled}
                prepend={tab.prepend}
                append={tab.append}
            >
                {tab.name}
            </EuiTab>
        ));
    };

    return (
        <>
            <EuiFlexGroup
                style={{ marginBottom: 10 }}
                justifyContent="spaceBetween"
            >
                <EuiFlexItem grow={true}>
                    <EuiText>
                        <h2>
                            {isLoading ? '' : data?.subscription?.description}
                        </h2>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem style={{ width: 140 }}>
                            <span style={{ marginTop: 5 }}>
                                Loading status
                                <EuiBadge
                                    style={{ marginLeft: 4 }}
                                    color={getColor(loadingStatus)}
                                >
                                    {loadingStatus}
                                </EuiBadge>
                            </span>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <SubscriptionActions
                                subscriptionId={subscriptionId}
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
            <>
                <EuiTabs>{renderTabs()}</EuiTabs>
                {selectedTabContent}
            </>

            {selectedTabId === GENERAL_TAB && <SubscriptionGeneral />}
            {selectedTabId === SERVICE_CONFIGURATION_TAB && (
                <SubscriptionDetailTree />
            )}
            {selectedTabId === PROCESSES_TAB && data && (
                <ProcessesTimeline subscriptionId={subscriptionId} />
            )}
        </>
    );
};
