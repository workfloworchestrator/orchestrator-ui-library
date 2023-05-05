import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import {
    EuiBadge,
    EuiCallOut,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiNotificationBadge,
    EuiPanel,
    EuiSpacer,
    EuiTab,
    EuiTabs,
    EuiText,
    EuiToken,
    EuiTreeView,
    EuiLoadingSpinner,
    EuiLoadingContent,
    EuiSearchBar,
} from '@elastic/eui';
import { GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '../../constants';
import { useQuery, useQueryClient } from 'react-query';
import { graphql } from '../../__generated__';
import { SubscriptionListQuery } from '../../__generated__/graphql';
import {
    SubscriptionActions,
    ProcessesTimeline,
    Tree,
    TreeContextType,
    TreeContext,
    TreeProvider,
} from '@orchestrator-ui/orchestrator-ui-components';
import NoSSR from 'react-no-ssr';

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
            productBlocks {
                id
                ownerSubscriptionId
                parent
                resourceTypes
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
                id
                ownerSubscriptionId
                parent
                resourceTypes
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
                id
                ownerSubscriptionId
                parent
                resourceTypes
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
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <EuiPanel>
                <div style={{ marginTop: 5 }}>
                    <EuiText>
                        <h3>{title}</h3>
                    </EuiText>
                    <EuiSpacer size={'xs'}></EuiSpacer>
                    <table width="100%" bgcolor={'#F1F5F9'}>
                        {keys.map((k, i) => (
                            <tr key={i}>
                                <td
                                    valign={'top'}
                                    style={{
                                        width: 250,
                                        padding: 10,
                                        borderBottom: 'solid 1px #ddd',
                                    }}
                                >
                                    {k.includes('.') ? k.split('.')[0] : k}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        borderBottom: 'solid 1px #ddd',
                                    }}
                                >
                                    {k.includes('.')
                                        ? data[k.split('.')[0]][k.split('.')[1]]
                                        : data[k]}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            {/*<td*/}
                            {/*    valign={'top'}*/}
                            {/*    style={{*/}
                            {/*        width: 250,*/}
                            {/*        padding: 10,*/}
                            {/*        borderBottom: 'solid 1px #ddd',*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <b>ID</b>*/}
                            {/*</td>*/}
                            {/*<td style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}>*/}
                            {/*    <a href="#">792225b3-f40a-4724-9f3e-15bc5668d3cd</a>*/}
                            {/*</td>*/}
                        </tr>
                    </table>
                </div>
            </EuiPanel>
        </>
    );
};

function getColor(num: number) {
    if (num === 1) return 'warning';
    if (num === 2) return 'primary';
    if (num === 3) return 'success';
    return 'error';
}

const DATA = [
    {
        id: '1',
        label: 'Food',
        children: [
            {
                id: '2',
                label: 'Meat',
            },
            {
                id: '3',
                label: 'Salad',
                children: [
                    {
                        id: '4',
                        label: 'Tomatoes',
                    },
                    {
                        id: '5',
                        label: 'Cabbage',
                    },
                ],
            },
        ],
    },
    {
        id: '6',
        label: 'Drinks',
        children: [
            {
                id: '7',
                label: 'Beer',
            },
            {
                id: '8',
                label: 'Soft drink',
            },
        ],
    },
];

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

function getTokenName(name: string) {
    const icons = {
        Node: 'tokenNamespace',
        'IP BGP Service Settings': 'tokenEnumMember',
        IP_PREFIX: 'tokenIP',
    };
    if (name in icons) {
        return icons[name];
    }
    return 'tokenConstant';
}

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);
const Subscription = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;
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

    const [selectedTreeNode, setSelectedTreeNode] = useState(-1);

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

    let tree = null; // Initially set our loop to null
    if (loadingStatus > 0) {
        const idToNodeMap = {}; // Keeps track of nodes using id as key, for fast lookup

        // loop over data
        data.subscription?.productBlocks.forEach(function (datum) {
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            const shallowCopy: any = { ...datum };

            // Each node will have children, so let's give it a "children" property
            shallowCopy.children = [];

            // Add an entry for this node to the map so that any future children can lookup the parent
            idToNodeMap[shallowCopy.id] = shallowCopy;

            // Does this node have a parent?
            if (shallowCopy.parent === null) {
                // Doesn't look like it, so this node is the root of the tree
                // Add EUI Fields
                shallowCopy.label = shallowCopy.resourceTypes.name;
                // shallowCopy.isExpanded = true;
                // shallowCopy.icon = <EuiIcon type="folderClosed" />;
                // shallowCopy.iconWhenExpanded = <EuiIcon type="folderOpen" />;
                shallowCopy.callback = () =>
                    setSelectedTreeNode(shallowCopy.id);
                tree = shallowCopy;
            } else {
                // This node has a parent, so let's look it up using the id
                const parentNode = idToNodeMap[shallowCopy.parent];
                const label =
                    shallowCopy.resourceTypes.title.length > 45
                        ? `${shallowCopy.resourceTypes.title.substring(
                              0,
                              45,
                          )}...`
                        : shallowCopy.resourceTypes.title;
                // Add EUI Fields
                shallowCopy.label = label;
                // shallowCopy.isExpanded = true;
                // shallowCopy.icon = <EuiIcon type="arrowRight" />;
                shallowCopy.callback = () =>
                    setSelectedTreeNode(shallowCopy.id);

                // We don't need this property, so let's delete it.
                // delete shallowCopy.parent;

                // Let's add the current node as a child of the parent node.
                if (
                    !data.subscription.productBlocks.find(
                        (i) => i.parent === shallowCopy.id,
                    )
                ) {
                    const tokenName = getTokenName(shallowCopy.label);
                    shallowCopy.icon = tokenName;
                }

                parentNode.children.push(shallowCopy);
            }
        });
        console.log('Tree', tree);
    }

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
    // const { selectedIds } = React.useContext(TreeContext) as TreeContextType;

    return (
        <NoSSR>
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
                <ProcessesTimeline />
            )}

            {selectedTabId === 'service-configuration--id' &&
                !isLoading &&
                data && (
                    <TreeProvider>
                        <EuiFlexGroup style={{ marginTop: 15 }}>
                            <EuiFlexItem style={{ maxWidth: 450, width: 450 }}>
                                <>
                                    <EuiText>
                                        <h3>Product blocks</h3>
                                    </EuiText>
                                    {tree === null && <EuiLoadingContent />}
                                    {tree !== null && (
                                        <>
                                            <Tree data={[tree]} />
                                            {/*<EuiTreeView*/}
                                            {/*    items={[tree]}*/}
                                            {/*    aria-label="Product blocks"*/}
                                            {/*/>*/}
                                        </>
                                    )}
                                </>
                            </EuiFlexItem>
                            <EuiFlexItem grow={true}>
                                <div>
                                    <EuiSearchBar />
                                    {selectedTreeNode === -1 && (
                                        <EuiCallOut
                                            style={{
                                                marginTop: 15,
                                                minHeight: 600,
                                            }}
                                            size="m"
                                            title="No product block selected"
                                            iconType="inspect"
                                        >
                                            <p>
                                                Select one or more product
                                                blocks to view their details
                                            </p>
                                        </EuiCallOut>
                                    )}
                                    {selectedTreeNode !== -1 &&
                                        Block(
                                            data.subscription.productBlocks[
                                                selectedTreeNode
                                            ].resourceTypes.title,
                                            data.subscription.productBlocks[
                                                selectedTreeNode
                                            ].resourceTypes,
                                        )}
                                </div>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </TreeProvider>
                )}

            {selectedTabId === 'general--id' && !isLoading && data && (
                <EuiFlexGrid columns={3}>
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
        </NoSSR>
    );
};

export default Subscription;
