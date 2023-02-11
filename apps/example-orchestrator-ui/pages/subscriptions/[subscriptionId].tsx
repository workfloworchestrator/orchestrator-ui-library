import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
    EuiButton,
    EuiCard,
    EuiDescriptionList,
    EuiDescriptionListTitle,
    EuiDescriptionListDescription,
    EuiFlexGrid,
    EuiFlexItem,
    EuiPageTemplate,
    EuiText,
    EuiBadge,
} from '@elastic/eui';

const GET_SUBSCRIPTION_DETAIL_OUTLINE = gql(/* GraphQL */ `
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

const GET_SUBSCRIPTION_DETAIL_COMPLETE = gql(/* GraphQL */ `
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
`);

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

const Subscription = () => {
    // Fetch data
    const router = useRouter();
    const { subscriptionId } = router.query;
    const { loading, data } = useQuery(
        GET_SUBSCRIPTION_DETAIL_OUTLINE,
        // variables are also typed!
        { variables: { id: subscriptionId } },
    );

    const { loading: loadingComplete, data: dataComplete } = useQuery(
        GET_SUBSCRIPTION_DETAIL_COMPLETE,
        // variables are also typed!
        { variables: { id: subscriptionId } },
    );

    // GUI hooks
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPanelled, setIsPanelled] = useState(false);
    const [isFluid, setIsFluid] = useState(true);

    // Track data progress
    let loadingStatus = 0;
    if (data) loadingStatus = 1;
    if (dataComplete) loadingStatus = 2;

    // console.log(GET_SUBSCRIPTION_DETAIL_OUTLINE);
    console.log(subscriptionId);

    return (
        <EuiPageTemplate
            panelled={isPanelled}
            restrictWidth={!isFluid}
            bottomBorder={true}
            offset={0}
            grow={false}
        >
            <EuiPageTemplate.Section
                grow={false}
                color="subdued"
                bottomBorder="extended"
            >
                SUPER SURF NAVIGATION
            </EuiPageTemplate.Section>
            <EuiPageTemplate.Header rightSideItems={[]}>
                <EuiButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    iconType={isSidebarOpen ? 'arrowLeft' : 'arrowRight'}
                >
                    {isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                </EuiButton>
                <EuiButton
                    onClick={() => setIsFluid(!isFluid)}
                    style={{ marginLeft: '5px' }}
                    iconType={isFluid ? 'minimize' : 'expand'}
                >
                    {isFluid ? 'Fixed' : 'Fluid'}
                </EuiButton>
                <EuiButton
                    onClick={() => setIsPanelled(!isPanelled)}
                    iconType={isPanelled ? 'inputOutput' : 'container'}
                    style={{ marginLeft: '5px' }}
                >
                    {isPanelled ? 'Un panel' : 'Panel'}
                </EuiButton>
                <span style={{ marginLeft: 50 }}>Loading status: </span>
                <EuiBadge color={getColor(loadingStatus)}>
                    {loadingStatus}
                </EuiBadge>
            </EuiPageTemplate.Header>
            {isSidebarOpen && (
                <EuiPageTemplate.Sidebar>Cool</EuiPageTemplate.Sidebar>
            )}
            <EuiPageTemplate.Section>
                <EuiText grow={false}>
                    <h2>
                        Name: {loading ? '' : data?.subscription.description}
                    </h2>
                </EuiText>
                {loading && (
                    <EuiPageTemplate.EmptyPrompt
                        title={<span>Loading data</span>}
                    >
                        No data yet
                    </EuiPageTemplate.EmptyPrompt>
                )}
                {!loading && data && (
                    <EuiFlexGrid columns={4}>
                        <EuiFlexItem>
                            {Block('General info', data.subscription)}
                        </EuiFlexItem>
                        <EuiFlexItem>
                            {Block(
                                'Customer info',
                                data.subscription.organisation,
                            )}
                        </EuiFlexItem>
                        <EuiFlexItem>
                            {Block('Product info', data.subscription.product)}
                        </EuiFlexItem>
                        <EuiFlexItem>
                            {Block(
                                'Fixed inputs',
                                data.subscription.fixedInputs,
                            )}
                        </EuiFlexItem>
                        {data.subscription.locations.map((l, i) => (
                            <EuiFlexItem>
                                {Block(`Location ${i + 1}`, l)}
                            </EuiFlexItem>
                        ))}
                        {!loadingComplete && dataComplete && (
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
                                            {l.ims.allEndpoints.map(
                                                (d, idx) => (
                                                    <EuiFlexItem>
                                                        {Block(
                                                            `Endpoint ${
                                                                idx + 1
                                                            }`,
                                                            d,
                                                        )}
                                                    </EuiFlexItem>
                                                ),
                                            )}
                                        </>
                                    ),
                                )}
                                {dataComplete.subscription.inUseBy.map(
                                    (l, i) => (
                                        <EuiFlexItem>
                                            {Block(`In use by ${i + 1}`, l)}
                                        </EuiFlexItem>
                                    ),
                                )}
                                {dataComplete.subscription.dependsOn.map(
                                    (l, i) => (
                                        <EuiFlexItem>
                                            {Block(`Depends on ${i + 1}`, l)}
                                        </EuiFlexItem>
                                    ),
                                )}
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
            </EuiPageTemplate.Section>
        </EuiPageTemplate>
    );
};

export default Subscription;
