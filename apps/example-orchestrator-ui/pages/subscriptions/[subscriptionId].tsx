import { useRouter } from 'next/router';
import React from 'react';
import {
    EuiCard,
    EuiDescriptionList,
    EuiDescriptionListTitle,
    EuiDescriptionListDescription,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiText,
    EuiBadge,
    EuiLoadingSpinner,
} from '@elastic/eui';
import { gql, GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '../../constants';
import { useQuery, useQueryClient } from 'react-query';

const GET_SUBSCRIPTION_DETAIL_OUTLINE = gql`
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
`;

const GET_SUBSCRIPTION_DETAIL_COMPLETE = gql`
    query GetSubscriptionDetailComplete($id: ID!) {
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
            name
            inUseBy {
                description
                tag
                subscriptionId
                status
            }
            dependsOn {
                description
                subscriptionId
                status
            }
            imsCircuits {
                ims {
                    aliases
                    allEndpoints {
                        id
                        locationOwner {
                            customerId
                            name
                            abbreviation
                            email
                            fax
                            status
                            tel
                            website
                        }
                        type
                        vlanranges
                        ... on ImsPort {
                            id
                            fiberType
                            connectorType
                            ifaceType
                            lineName
                            node
                            status
                            port
                            patchposition
                            vlanranges
                            type
                        }
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
                            service {
                                aliases
                                domain
                                product
                                status
                                name
                                id
                                speed
                                extraInfo
                            }
                        }
                    }
                    id
                    location
                    extraInfo
                    name
                    speed
                    status
                    product
                }
                imsCircuitId
            }
        }
    }
`;

const Block = (title, data: object) => {
    // Todo: investigate -> for some reason I can't just use `keys()`
    const keys = [];
    for (const key in data) {
        if (typeof data[key] !== 'object') {
            keys.push(key);
        }
    }
    if (keys.length === 0) return;

    return (
        <EuiCard title={title}>
            <EuiDescriptionList>
                {keys.map((k) => (
                    <>
                        <EuiDescriptionListTitle>{k}</EuiDescriptionListTitle>
                        <EuiDescriptionListDescription>
                            {data[k]}
                        </EuiDescriptionListDescription>
                    </>
                ))}
            </EuiDescriptionList>
        </EuiCard>
    );
};

function getColor(num: number) {
    if (num === 1) return 'warning';
    if (num === 2) return 'success';
    return 'error';
}

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);
const Subscription = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;
    const queryClient = useQueryClient();
    const prefetchedData = {
        subscription: queryClient
            .getQueryData('subscriptions')
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
    const { isLoading, data } = useQuery(
        ['subscription-outline', subscriptionId],
        fetchSubscriptionOutline,
        { placeholderData: () => prefetchedData },
    );
    const { isLoading: isLoadingComplete, data: dataComplete } = useQuery(
        ['subscription-complete', subscriptionId],
        fetchSubscriptionComplete,
    );

    // Track data progress
    let loadingStatus = 0;
    if (data) loadingStatus = 1;
    if (dataComplete) loadingStatus = 2;

    console.log(subscriptionId);

    return (
        <>
            <EuiFlexGroup style={{ marginBottom: 10 }}>
                <EuiFlexItem grow={false}>
                    <EuiText>
                        <h2>
                            Name:{' '}
                            {isLoading ? '' : data?.subscription.description}
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

            {!isLoading && data && (
                <EuiFlexGrid columns={4}>
                    <EuiFlexItem>
                        {Block('General info', data.subscription)}
                    </EuiFlexItem>
                    <EuiFlexItem>
                        {Block('Customer info', data.subscription.organisation)}
                    </EuiFlexItem>
                    <EuiFlexItem>
                        {Block('Product info', data.subscription.product)}
                    </EuiFlexItem>
                    <EuiFlexItem>
                        {Block('Fixed inputs', data.subscription.fixedInputs)}
                    </EuiFlexItem>
                    {data.subscription.locations?.map((l, i) => (
                        <EuiFlexItem key={`loc-${i}`}>
                            {Block(`Location ${i + 1}`, l)}
                        </EuiFlexItem>
                    ))}
                    {!isLoadingComplete && dataComplete && (
                        <>
                            {dataComplete.subscription.imsCircuits.map(
                                (l, i) => (
                                    <>
                                        <EuiFlexItem>
                                            {Block(
                                                `IMS circuit ${i + 1}`,
                                                l.ims,
                                            )}
                                        </EuiFlexItem>
                                        {l.ims.allEndpoints.map((d, idx) => (
                                            <EuiFlexItem
                                                key={`endpoint-${idx}`}
                                            >
                                                {Block(
                                                    `Endpoint ${idx + 1}`,
                                                    d,
                                                )}
                                            </EuiFlexItem>
                                        ))}
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
                            <EuiFlexItem>
                                {Block(
                                    'Product info',
                                    data.subscription.product,
                                )}
                            </EuiFlexItem>
                            <EuiFlexItem>
                                {Block(
                                    'Product info',
                                    data.subscription.product,
                                )}
                            </EuiFlexItem>
                        </>
                    )}
                </EuiFlexGrid>
            )}
        </>
    );
};

export default Subscription;
