// The final implementation of this component happens in a different story
// @ts-nocheck
import { useRouter } from 'next/router';
import React, { Fragment, useMemo, useState } from 'react';
import {
    EuiCard,
    EuiDescriptionList,
    EuiDescriptionListTitle,
    EuiDescriptionListDescription,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiNotificationBadge,
    EuiSpacer,
    EuiTab,
    EuiTabs,
    EuiText,
    EuiToken,
    EuiTreeView,
    EuiBadge,
    EuiLoadingSpinner,
} from '@elastic/eui';
import { GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '../../constants';
import { useQuery, useQueryClient } from 'react-query';
import { graphql } from '../../__generated__';
import { SubscriptionListQuery } from '../../__generated__/graphql';

const GET_SUBSCRIPTION_DETAIL_OUTLINE = graphql(`
    query GetSubscriptionDetailOutline($id: ID!) {
        subscription(id: $id) {
            customerId
            description
            endDate
            firewallEnabled
            fixedInputs
            insync
            note
            product {
                name
                status
                endDate
                description
                tag
                type
            }
            startDate
            status
            subscriptionId
            customerDescriptions {
                description
            }
            organisation {
                abbreviation
                name
                website
                tel
            }
            locations {
                abbreviation
                name
            }
        }
    }
`);

const GET_SUBSCRIPTION_DETAIL_COMPLETE = graphql(`
    query GetSubscriptionDetailComplete($id: ID!) {
        subscription(id: $id) {
            note
            name
            startDate
            endDate
            tag
            vlanRange
            customerId
            customerDescriptions {
                description
                customerId
            }
            description
            firewallEnabled
            fixedInputs
            product {
                name
                status
                endDate
                tag
                type
                description
                createdAt
            }
            status
            locations {
                name
                email
                website
                abbreviation
            }
            inUseBy {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            dependsOn {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            organisation {
                abbreviation
                email
                fax
                name
                status
                tel
                website
                customerId
            }
            productBlocks {
                resourceTypes
                ownerSubscriptionId
            }
        }
    }
`);

const GET_SUBSCRIPTION_DETAIL_ENRICHED = graphql(`
    query GetSubscriptionDetailEnriched($id: ID!) {
        subscription(id: $id) {
            note
            name
            startDate
            endDate
            tag
            vlanRange
            customerId
            customerDescriptions {
                description
                customerId
            }
            description
            firewallEnabled
            fixedInputs
            product {
                name
                status
                endDate
                tag
                type
                description
                createdAt
            }
            status
            locations {
                name
                email
                website
                abbreviation
            }
            imsCircuits {
                ims {
                    id
                    name
                    extraInfo
                    aliases
                    allEndpoints {
                        vlanranges
                        ... on ImsPort {
                            id
                            connectorType
                            fiberType
                            ifaceType
                            lineName
                            node
                            patchposition
                            port
                            status
                            type
                            vlanranges
                        }
                        id
                        type
                        ... on ImsInternalPort {
                            id
                            lineName
                            node
                            port
                            type
                            vlanranges
                        }
                        ... on ImsService {
                            id
                            location
                            type
                            vlanranges
                        }
                        location
                    }
                }
            }
            inUseBy {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            dependsOn {
                description
                name
                product {
                    name
                }
                startDate
                status
                subscriptionId
            }
            organisation {
                abbreviation
                email
                fax
                name
                status
                tel
                website
                customerId
            }
            productBlocks {
                resourceTypes
                ownerSubscriptionId
            }
        }
    }
`);

const Block = (title, data: object) => {
    // Todo: investigate -> for some reason I can't just use `keys()`
    const keys = [];
    for (const key in data) {
        if (typeof data[key] !== 'object') {
            keys.push(key);
        }
        if (key == 'product') {
            keys.push('product.name');
        }
    }
    if (keys.length === 0) return;

    return (
        <EuiCard title={title}>
            <EuiDescriptionList>
                {keys.map((k) => (
                    <>
                        <EuiDescriptionListTitle>
                            {k.includes('.') ? k.split('.')[0] : k}
                        </EuiDescriptionListTitle>
                        <EuiDescriptionListDescription>
                            {k.includes('.')
                                ? data[k.split('.')[0]][k.split('.')[1]]
                                : data[k]}
                        </EuiDescriptionListDescription>
                    </>
                ))}
            </EuiDescriptionList>
        </EuiCard>
    );
};

function getColor(num: number) {
    if (num === 1) return 'warning';
    if (num === 2) return 'primary';
    if (num === 3) return 'success';
    return 'error';
}

const tabs = [
    {
        id: 'general--id',
        name: 'General',
        prepend: <EuiIcon type="devToolsApp" />,
    },
    {
        id: 'service-configuration--id',
        name: 'Service configuration',
        prepend: <EuiIcon type="submodule" />,
    },
    {
        id: 'processes--id',
        disabled: true,
        name: 'Processes',
        prepend: <EuiIcon type="indexRuntime" />,
    },
    {
        id: 'related-subscriptions--id',
        disabled: true,
        name: 'Related subscriptions',
        prepend: <EuiIcon type="heatmap" />,
    },
    {
        id: 'notifications--id',
        name: 'Notifications',
        append: (
            <EuiNotificationBadge className="eui-alignCenter" size="m">
                10
            </EuiNotificationBadge>
        ),
    },
];

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);
const Subscription = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;
    const [selectedTabId, setSelectedTabId] = useState(
        'service-configuration--id',
    );
    const selectedTabContent = useMemo(() => {
        return tabs.find((obj) => obj.id === selectedTabId)?.content;
    }, [selectedTabId]);

    const onSelectedTabChanged = (id: string) => {
        setSelectedTabId(id);
    };
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
        { placeholderData: () => prefetchedData },
    );
    const { isLoading: isLoadingComplete, data: dataComplete } = useQuery(
        ['subscription-complete', subscriptionId],
        fetchSubscriptionComplete,
    );
    const { isLoading: isLoadingEnriched, data: dataEnriched } = useQuery(
        ['subscription-enriched', subscriptionId],
        fetchSubscriptionEnriched,
    );

    // Track data progress
    let loadingStatus = 0;
    if (data) loadingStatus = 1;
    if (dataComplete) loadingStatus = 2;
    if (dataEnriched) loadingStatus = 3;

    console.log(subscriptionId);
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

    const items = [
        {
            label: 'Item One',
            id: 'item_one',
            icon: <EuiIcon type="folderClosed" />,
            iconWhenExpanded: <EuiIcon type="folderOpen" />,
            isExpanded: true,
            children: [
                {
                    label: 'Item A',
                    id: 'item_a',
                    icon: <EuiIcon type="document" />,
                },
                {
                    label: 'Item B',
                    id: 'item_b',
                    icon: <EuiIcon type="arrowRight" />,
                    iconWhenExpanded: <EuiIcon type="arrowDown" />,
                    children: [
                        {
                            label: 'A Cloud',
                            id: 'item_cloud',
                            icon: <EuiToken iconType="tokenConstant" />,
                        },
                        {
                            label: "I'm a Bug",
                            id: 'item_bug',
                            icon: <EuiToken iconType="tokenEnum" />,
                            callback: () => {},
                        },
                    ],
                },
                {
                    label: 'Item C',
                    id: 'item_c',
                    icon: <EuiIcon type="arrowRight" />,
                    iconWhenExpanded: <EuiIcon type="arrowDown" />,
                    children: [
                        {
                            label: 'Another Cloud',
                            id: 'item_cloud2',
                            icon: <EuiToken iconType="tokenConstant" />,
                        },
                        {
                            label: 'This one is a really long string that we will check truncates correctly',
                            id: 'item_bug2',
                            icon: <EuiToken iconType="tokenEnum" />,
                            callback: () => {},
                        },
                    ],
                },
            ],
        },
        {
            label: 'Item Two',
            id: 'item_two',
        },
    ];

    return (
        <>
            <EuiFlexGroup style={{ marginBottom: 10 }}>
                <EuiFlexItem grow={false}>
                    <EuiText>
                        <h2>
                            {isLoading ? '' : data?.subscription?.description}
                        </h2>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                    <div style={{ marginTop: 5 }}>
                        Loading status:
                        <EuiBadge color={getColor(loadingStatus)}>
                            {loadingStatus}
                        </EuiBadge>
                    </div>
                </EuiFlexItem>
            </EuiFlexGroup>
            {isLoading && <EuiLoadingSpinner />}

            <>
                <EuiTabs>{renderTabs()}</EuiTabs>
                {selectedTabContent}
            </>

            {selectedTabId === 'service-configuration--id' &&
                !isLoading &&
                data && (
                    <EuiFlexGrid columns={2} style={{ marginTop: 15 }}>
                        <EuiFlexItem>
                            <>
                                <EuiText>
                                    <h3>Product blocks</h3>
                                </EuiText>
                                <EuiTreeView
                                    items={items}
                                    aria-label="Product blocks"
                                />
                            </>
                        </EuiFlexItem>
                        <EuiFlexItem>Info</EuiFlexItem>
                    </EuiFlexGrid>
                )}

            {selectedTabId === 'general--id' && !isLoading && data && (
                <EuiFlexGrid columns={4}>
                    <EuiFlexItem>
                        {Block('General info', data.subscription)}
                    </EuiFlexItem>
                    <EuiFlexItem>
                        {Block(
                            'Customer info',
                            data.subscription?.organisation,
                        )}
                    </EuiFlexItem>
                    <EuiFlexItem>
                        {Block('Product info', data.subscription?.product)}
                    </EuiFlexItem>
                    <EuiFlexItem>
                        {Block('Fixed inputs', data.subscription?.fixedInputs)}
                    </EuiFlexItem>
                    {data.subscription?.locations?.map((l, i) => (
                        <EuiFlexItem key={`loc-${i}`}>
                            {Block(`Location ${i + 1}`, l)}
                        </EuiFlexItem>
                    ))}
                    {!isLoadingComplete && dataComplete && (
                        <>
                            {dataComplete.subscription?.productBlocks?.map(
                                (l, i) => (
                                    <>
                                        <EuiFlexItem>
                                            {Block(
                                                `Product Block ${i + 1}`,
                                                l.resourceTypes,
                                            )}
                                        </EuiFlexItem>
                                    </>
                                ),
                            )}
                            {dataComplete.subscription.inUseBy.map((l, i) => (
                                <EuiFlexItem key={`in-use-by-${i}`}>
                                    {Block(`In use by ${i + 1}`, l)}
                                </EuiFlexItem>
                            ))}
                            {dataComplete.subscription.dependsOn.map((l, i) => (
                                <EuiFlexItem key={`depends-on-${i}`}>
                                    {Block(`Depends on ${i + 1}`, l)}
                                </EuiFlexItem>
                            ))}
                        </>
                    )}
                    {!isLoadingEnriched &&
                        dataEnriched &&
                        dataEnriched.subscription?.imsCircuits?.map((l, i) => (
                            <>
                                <EuiFlexItem>
                                    {Block(`IMS circuit ${i + 1}`, l.ims)}
                                </EuiFlexItem>
                                {l.ims.allEndpoints.map((d, idx) => (
                                    <EuiFlexItem key={`endpoint-${idx}`}>
                                        {Block(`Endpoint ${idx + 1}`, d)}
                                    </EuiFlexItem>
                                ))}
                            </>
                        ))}
                </EuiFlexGrid>
            )}
        </>
    );
};

export default Subscription;
