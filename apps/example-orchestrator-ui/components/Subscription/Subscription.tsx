import React, { FC, useMemo, useState } from 'react';
import {
    ProcessesTimeline,
    SubscriptionActions,
    SubscriptionDetailTree,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    EuiBadge,
    EuiFlexGrid,
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
    GET_SUBSCRIPTION_DETAIL_ENRICHED,
    GET_SUBSCRIPTION_DETAIL_OUTLINE,
} from './subscriptionQuery';
import {
    SubscriptionContext,
    SubscriptionContextType,
} from '@orchestrator-ui/orchestrator-ui-components';
import { getColor, tabs } from './utils';
import { SubscriptionGeneral } from './General';

type SubscriptionProps = {
    subscriptionId: string | string[];
};

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);

export const Subscription: FC<SubscriptionProps> = ({ subscriptionId }) => {
    const { theme } = useOrchestratorTheme();
    const { subscriptionData, setSubscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext) as SubscriptionContextType;

    const [selectedTabId, setSelectedTabId] = useState(
        'service-configuration--id',
    );
    const selectedTabContent = useMemo(() => {
        // @ts-ignore: todo -> improve tabs, refactor them to separate component
        return tabs.find((obj) => obj.id === selectedTabId)?.content;
    }, [selectedTabId]);

    const onSelectedTabChanged = (id: string) => {
        setSelectedTabId(id);
    };

    // Gui state done, deal with data:
    const queryClient = useQueryClient();
    const prefetchedData = {
        subscription: queryClient
            .getQueryData<SubscriptionListQuery>('subscriptions')
            ?.subscriptions.edges.find(
                (d) => d.node.subscriptionId == subscriptionId,
            ).node,
    };

    // Fetch data
    const fetchSubscriptionOutline = async () => {
        return await graphQLClient.request(GET_SUBSCRIPTION_DETAIL_OUTLINE, {
            id: subscriptionId,
        });
    };
    const fetchSubscriptionComplete = async () => {
        return await graphQLClient.request(GET_SUBSCRIPTION_DETAIL_COMPLETE, {
            id: subscriptionId,
        });
    };

    const fetchSubscriptionEnriched = async () => {
        return await graphQLClient.request(GET_SUBSCRIPTION_DETAIL_ENRICHED, {
            id: subscriptionId,
        });
    };
    const { isLoading, data } = useQuery(
        ['subscription-outline', subscriptionId],
        fetchSubscriptionOutline,
        // @ts-ignore
        {
            placeholderData: () => prefetchedData,
            onSuccess: (s) => setSubscriptionData(s, 1),
        },
    );
    const { isLoading: isLoadingComplete, data: dataComplete } = useQuery(
        ['subscription-complete', subscriptionId],
        fetchSubscriptionComplete,
        { onSuccess: (s) => setSubscriptionData(s, 2) },
    );
    const { isLoading: isLoadingEnriched, data: dataEnriched } = useQuery(
        ['subscription-enriched', subscriptionId],
        fetchSubscriptionEnriched,
        { onSuccess: (s) => setSubscriptionData(s, 3) },
    );

    const renderTabs = () => {
        return tabs.map((tab, index) => (
            <EuiTab
                key={index}
                // href={tab.href}
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
            {isLoading && <EuiLoadingSpinner />}

            <>
                <EuiTabs>{renderTabs()}</EuiTabs>
                {selectedTabContent}
            </>

            {selectedTabId === 'processes--id' && !isLoading && data && (
                <ProcessesTimeline subscriptionId={subscriptionId} />
            )}

            {selectedTabId === 'service-configuration--id' && (
                <SubscriptionDetailTree />
            )}

            {selectedTabId === 'general--id' && loadingStatus > 0 && (
                <SubscriptionGeneral />
            )}
        </>
    );
};
