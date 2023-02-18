import React, { useState } from 'react';
import Link from 'next/link';
import {
    EuiBadge,
    EuiBasicTableColumn,
    EuiButton,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner,
    EuiInMemoryTable,
    EuiPageTemplate,
    EuiText,
} from '@elastic/eui';
import { useQuery } from 'react-query';
import request, { gql } from 'graphql-request';

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

const columns: Array<EuiBasicTableColumn<any>> = [
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
    const { isLoading, error, data } = useQuery('subscriptions', () =>
        request(
            'https://api.dev.automation.surf.net/pythia',
            GET_SUBSCRIPTIONS,
        ),
    );

    let tableData = [];

    if (error) {
        console.log('Error', error);
    }

    if (!isLoading && data) {
        console.log(data);
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

    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiText>
                        <h2>Subscriptions</h2>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiButtonIcon
                        style={{ marginTop: 3 }}
                        iconSize={'l'}
                        iconType={'refresh'}
                    ></EuiButtonIcon>
                </EuiFlexItem>
            </EuiFlexGroup>
            {isLoading && <EuiLoadingSpinner />}
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
        </>
    );
}

export default Subscriptions;
