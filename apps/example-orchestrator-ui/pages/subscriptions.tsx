import React, { useState } from 'react';
import Link from 'next/link';
import {
    EuiBadge,
    EuiBasicTableColumn,
    EuiButton,
    EuiButtonIcon,
    EuiInMemoryTable,
    EuiPageTemplate,
    EuiText,
} from '@elastic/eui';
import { gql } from '@apollo/client';
import { SubscriptionListQuery } from '../__generated__/graphql';
import {useQuery} from "react-query";
import request from "graphql-request";

const GET_SUBSCRIPTIONS = gql`
    query SubscriptionList {
        subscriptions(first: 500) {
            edges {
                node {
                    note
                    name
                    startDate
                    endDate
                    tag
                    productId
                    portSubscriptionInstanceId
                    vlanRange
                    description
                    product {
                        name
                        type
                        tag
                    }
                    insync
                    status
                    subscriptionId
                }
            }
        }
    }
`;

// Todo: find out how to load from utils in core
export const getStatusBadgeColor = (status: string) => {
    const statusColors = {
        terminated: 'danger',
        active: 'success',
        provisioning: 'primary',
        migrating: 'primary',
        initial: 'danger',
    };
    // eslint-disable-next-line no-prototype-builtins
    return statusColors.hasOwnProperty(status)
        ? statusColors[status]
        : 'primary';
};

const columns: Array<EuiBasicTableColumn<SubscriptionListQuery>> = [
    {
        field: 'node.subscriptionId',
        name: 'ID',
        render: (subscriptionId: string) => (
            <Link href={`/subscriptions/${subscriptionId}`}>
                {subscriptionId.slice(0, 8)}
            </Link>
        ),
        mobileOptions: {
            show: false,
        },
        width: '8%',
        sortable: true,
    },
    {
        field: 'node.description',
        name: 'Description',
        truncateText: true,
        width: '35%',
        sortable: true,
    },
    {
        field: 'node.product.name',
        name: 'Product',
        truncateText: true,
        width: '20%',
        sortable: true,
    },
    {
        field: 'node.status',
        name: 'Status',
        truncateText: true,
        mobileOptions: {
            show: false,
        },
        width: '10%',
        render: (status: string) => (
            <EuiBadge color={getStatusBadgeColor(status)} isDisabled={false}>
                {status}
            </EuiBadge>
        ),
        sortable: true,
    },
    {
        field: 'node.insync',
        name: 'Sync',
        truncateText: true,
        mobileOptions: {
            show: false,
        },
        width: '10%',
        render: (status: boolean) => (
            <EuiBadge color={status ? 'success' : 'danger'} isDisabled={false}>
                {status.toString()}
            </EuiBadge>
        ),
        sortable: true,
    },
    {
        field: 'node.startDate',
        name: 'Start date',
        truncateText: true,
        render: (startDate: number | null) =>
            startDate ? new Date(startDate * 1000).toLocaleString('nl-NL') : '',
        mobileOptions: {
            show: false,
        },
        sortable: true,
    },
];

export function Subscriptions() {
    // GUI hooks
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPanelled, setIsPanelled] = useState(false);
    const [isFluid, setIsFluid] = useState(true);

    const { isLoading, error, data } = useQuery("subscription", () => request("https://api.dev.automation.surf.net/pythia", GET_SUBSCRIPTIONS));

    let tableData = [];

    if(error) {
        console.log("Error", error)
    }

    if (!isLoading && data) {
        console.log(data)
        tableData = data.subscriptions.edges;
    }

    // const search: EuiSearchBarProps = {
    //     box: {
    //         schema: true,
    //         incremental: true,
    //     },
    //     filters: !filters
    //         ? undefined
    //         : [
    //             {
    //                 type: 'is',
    //                 field: 'node.insync',
    //                 name: 'In sync',
    //                 negatedName: 'Not in sync',
    //             },
    //
    //         ],
    // };

    const button = () => <EuiButtonIcon iconType={'refresh'}></EuiButtonIcon>;
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
            <EuiPageTemplate.Header rightSideItems={[button()]}>
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
            </EuiPageTemplate.Header>
            {isSidebarOpen && (
                <EuiPageTemplate.Sidebar>Cool</EuiPageTemplate.Sidebar>
            )}
            <EuiPageTemplate.Section>
                <EuiText grow={false}>
                    <h2>Subscriptions</h2>
                </EuiText>
                {isLoading && (
                    <EuiPageTemplate.EmptyPrompt
                        title={<span>Loading data</span>}
                    >
                        No data yet
                    </EuiPageTemplate.EmptyPrompt>
                )}
                {!isLoading && data && (
                    <EuiInMemoryTable
                        tableCaption="Demo of EuiInMemoryTable with search"
                        items={tableData}
                        columns={columns}
                        // search={search}
                        pagination={false}
                        sorting={true}
                    />
                )}
            </EuiPageTemplate.Section>
        </EuiPageTemplate>
    );
}

export default Subscriptions;
