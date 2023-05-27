import React, { FC, useMemo, useState } from 'react';
import {
    General,
    ProcessesTimeline,
    SubscriptionActions,
    SubscriptionDetailTree,
    SubscriptionGeneral,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingContent,
    EuiLoadingSpinner,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';
import { useQuery, useQueryClient } from 'react-query';
import { SubscriptionListQuery } from '../../__generated__/graphql';
import { GRAPHQL_ENDPOINT } from '../../constants';
import { GraphQLClient } from 'graphql-request';
import {
    GET_SUBSCRIPTION_DETAIL_COMPLETE,
    GET_SUBSCRIPTION_DETAIL_OUTLINE,
    mapApiResponseToSubscriptionDetail,
} from './subscriptionQuery';
import { SubscriptionContext } from '@orchestrator-ui/orchestrator-ui-components';
import { getColor, tabs } from './utils';

type SubscriptionProps = {
    subscriptionId: string | string[];
};

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export const Subscription: FC<SubscriptionProps> = ({ subscriptionId }) => {
    // if(!subscriptionId) return // Todo investigate why first call doesn't have subscriptionID

    const { setSubscriptionData, subscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext);

    // Tab state
    const [selectedTabId, setSelectedTabId] = useState('general-id');
    const selectedTabContent = useMemo(() => {
        // @ts-ignore: todo -> improve tabs, refactor them to separate component
        return tabs.find((obj) => obj.id === selectedTabId)?.content;
    }, [selectedTabId]);
    const onSelectedTabChanged = (id: string) => {
        setSelectedTabId(id);
    };

    // Gui state done, deal with data:
    // const queryClient = useQueryClient();
    // const prefetchedData = {
    //     subscription: queryClient
    //         .getQueryData<SubscriptionListQuery>('subscriptions')
    //         ?.subscriptions.edges.find(
    //             (d) => d.node.subscriptionId == subscriptionId,
    //         ).node,
    // };

    // Fetch data
    const fetchSubscriptionOutline = async () => {
        console.log('Fetch outline for ID: ', subscriptionId);
        return await graphQLClient.request(GET_SUBSCRIPTION_DETAIL_OUTLINE, {
            id: subscriptionId,
        });
    };
    const fetchSubscriptionComplete = async () => {
        // @ts-ignore Todo: investigate why this generated query is not type safe. Pythia problem with imsCircuits?
        console.log('Fetch complete for ID: ', subscriptionId);
        return await graphQLClient.request(GET_SUBSCRIPTION_DETAIL_COMPLETE, {
            id: subscriptionId,
        });
    };

    const { isLoading, data } = useQuery(
        ['subscription-outline', subscriptionId],
        fetchSubscriptionOutline,
        {
            // placeholderData: () => prefetchedData,
            onSuccess: (s) =>
                setSubscriptionData(
                    mapApiResponseToSubscriptionDetail(s, false),
                    1,
                ),
        },
    );
    const { isLoading: isLoadingComplete, data: dataComplete } = useQuery(
        ['subscription-complete', subscriptionId],
        fetchSubscriptionComplete,
        {
            onSuccess: (s) =>
                setSubscriptionData(
                    mapApiResponseToSubscriptionDetail(s, true),
                    2,
                ),
        },
    );

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
            {/*{isLoading && <EuiLoadingSpinner />}*/}

            <>
                <EuiTabs>{renderTabs()}</EuiTabs>
                {selectedTabContent}
            </>

            {selectedTabId === 'processes-id' && data && (
                <ProcessesTimeline subscriptionId={subscriptionId} />
            )}

            {selectedTabId === 'service-configuration-id' && (
                <SubscriptionDetailTree />
            )}

            {selectedTabId === 'general-id' && <SubscriptionGeneral />}
        </>
    );
};
