import React from 'react';
import Link from 'next/link';
import {
    EuiBadge,
    EuiBasicTableColumn,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner,
    EuiInMemoryTable,
    EuiText,
} from '@elastic/eui';

import { getStatusBadgeColor } from '@orchestrator-ui/orchestrator-ui-components';

import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { graphql } from '../__generated__';

import { GRAPHQL_ENDPOINT } from '../constants';

const GET_SUBSCRIPTIONS = graphql(`
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
`);

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);
const fetchSubscriptions = async () => {
    return await graphQLClient.request(GET_SUBSCRIPTIONS);
};

const columns: Array<EuiBasicTableColumn<never>> = [
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
    const { isLoading, error, data } = useQuery(
        'subscriptions',
        fetchSubscriptions,
    );

    let tableData = [];

    if (error) {
        console.log('Error', error);
    }

    if (!isLoading && data) {
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
                <EuiFlexItem>{isLoading && <EuiLoadingSpinner />}</EuiFlexItem>
            </EuiFlexGroup>
            {!isLoading && data && (
                <EuiInMemoryTable
                    tableCaption="Demo of EuiInMemoryTable with search"
                    // @ts-ignore
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
