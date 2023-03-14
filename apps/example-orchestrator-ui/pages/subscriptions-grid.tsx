import 'regenerator-runtime/runtime';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
    EuiBadge,
    EuiBasicTableColumn,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiDataGridColumn,
    EuiFlexItem,
    EuiLoadingSpinner,
    EuiInMemoryTable,
    EuiPanel,
    EuiText,
    EuiDataGrid,
} from '@elastic/eui';

import { getStatusBadgeColor } from '@orchestrator-ui/orchestrator-ui-components';

import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { graphql } from '../__generated__';

import { GRAPHQL_ENDPOINT } from '../constants';
const DataContext = createContext();

const GET_SUBSCRIPTIONS_PAGINATED = graphql(`
    query SubscriptionGrid($first: Int!, $after: Int!) {
        subscriptions(first: $first, after: $after) {
            edges {
                node {
                    note
                    name
                    startDate
                    endDate
                    tag
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


const columns: Array<EuiDataGridColumn<never>> = [
    {
        id: 'node.subscriptionId',
        displayAsText: 'ID',
        defaultSortDirection: 'asc',
        cellActions: [
            ({ rowIndex, columnId, Component }) => {
                const data = useContext(DataContext);
                return (
                    <Component
                        onClick={() => alert(`Hi ${columnId}`)}
                        iconType="heart"
                        aria-label={`Hi ${columnId}`}
                    >
                        Say hi
                    </Component>
                );
            },
            // ({ rowIndex, columnId, Component }) => {
            //     const data = useContext(DataContext);
            //     return (
            //         <Component
            //             onClick={() => alert(`Bye ${data[rowIndex][columnId].raw}`)}
            //             iconType="moon"
            //             aria-label={`Say bye to ${data[rowIndex][columnId].raw}!`}
            //         >
            //             Say bye
            //         </Component>
            //     );
            // },
        ],
    },
    {
        id: 'node.description',
        displayAsText: 'Description',
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.product.name',
        displayAsText: 'Product',
        // defaultSortDirection: 'asc',
    },

    {
        id: 'node.status',
        displayAsText: 'Status',
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.insync',
        displayAsText: 'In sync?',
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.startDate',
        displayAsText: 'Start date',
        // defaultSortDirection: 'asc',
    },
    {
        id: 'hidden4',
        displayAsText: 'Hidden 4',
        // defaultSortDirection: 'asc',
    },

    // {
    //     field: 'node.status',
    //     name: 'Status',
    //     truncateText: true,
    //     mobileOptions: {
    //         show: false,
    //     },
    //     width: '10%',
    //     render: (status: string) => (
    //         <EuiBadge color={getStatusBadgeColor(status)} isDisabled={false}>
    //             {status}
    //         </EuiBadge>
    //     ),
    //     sortable: true,
    // },
    // {
    //     field: 'node.insync',
    //     name: 'Sync',
    //     truncateText: true,
    //     mobileOptions: {
    //         show: false,
    //     },
    //     width: '10%',
    //     render: (status: boolean) => (
    //         <EuiBadge color={status ? 'success' : 'danger'} isDisabled={false}>
    //             {status.toString()}
    //         </EuiBadge>
    //     ),
    //     sortable: true,
    // },
    // {
    //     field: 'node.startDate',
    //     name: 'Start date',
    //     truncateText: true,
    //     render: (startDate: number | null) =>
    //         startDate ? new Date(startDate * 1000).toLocaleString('nl-NL') : '',
    //     mobileOptions: {
    //         show: false,
    //     },
    //     sortable: true,
    // },
];

const defaultVisibleColumns = [
    'node.subscriptionId',
    'node.description',
    'node.product.name',
    'node.status',
    'node.insync',
    'node.startDate',
];

const RenderCellValue = ({ rowIndex, columnId, setCellProps }) => {
    const data = useContext(DataContext);
    // useEffect(() => {
    //     if (columnId === 'amount') {
    //         if (data.hasOwnProperty(rowIndex)) {
    //             const numeric = parseFloat(
    //                 data[rowIndex][columnId].match(/\d+\.\d+/)[0],
    //                 10
    //             );
    //             setCellProps({
    //                 style: {
    //                     backgroundColor: `rgba(0, 255, 0, ${numeric * 0.0002})`,
    //                 },
    //             });
    //         }
    //     }
    // }, [rowIndex, columnId, setCellProps, data]);

    function getFormatted() {
        // debugger
        if(rowIndex>=data.length) {
            return null
        }

        console.log('Col: ', columnId.replace('node.', ''));
        const value = data[rowIndex].node[columnId.replace('node.', '')];
        switch (columnId) {
            case 'node.product.name':
                return data[rowIndex].node['product']['name'];
            case 'node.startDate':
                return value
                    ? new Date(value * 1000).toLocaleString('nl-NL')
                    : '';
            case 'node.status':
                return (
                    <EuiBadge
                        color={getStatusBadgeColor(value)}
                        isDisabled={false}
                    >
                        {value}
                    </EuiBadge>
                );
            case 'node.insync':
                return (
                    <EuiBadge
                        color={value ? 'success' : 'danger'}
                        isDisabled={false}
                    >
                        {value.toString()}
                    </EuiBadge>
                );
            default:
                return value;
        }
    }

    // return getFormatted(rowIndex, columnId);
    return getFormatted();
};

export function SubscriptionsGrid() {
    const [first, setFirst] = useState(3);
    const [after, setAfter] = useState(0);
    const fetchSubscriptions = async () => {
        return await graphQLClient.request(GET_SUBSCRIPTIONS_PAGINATED, {first: first, after: after});
    };
    const { isLoading, error, data } = useQuery(
        ['subscriptions', first, after],
        fetchSubscriptions,
    );

    let tableData = [];

    if (error) {
        console.log('Error', error);
    }

    if (!isLoading && data) {
        tableData = data.subscriptions.edges;
        console.log(tableData);
    }

    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiText>
                        <h2>Subscriptions</h2>

                    </EuiText>
                </EuiFlexItem>
                {isLoading && <EuiFlexItem><EuiLoadingSpinner /></EuiFlexItem>}
                {after>=3 && <EuiFlexItem grow={false}><EuiButtonIcon iconType="arrowLeft" onClick={() => setAfter(after-3)}></EuiButtonIcon></EuiFlexItem>}
                <EuiFlexItem grow={false}><EuiButtonIcon iconType="arrowRight" onClick={() => setAfter(after+3)}></EuiButtonIcon></EuiFlexItem>
            </EuiFlexGroup>
            {!isLoading && data && (
                <EuiPanel>
                    <DataContext.Provider value={tableData}>
                        <EuiDataGrid
                            columns={columns}
                            columnVisibility={{
                                visibleColumns,
                                setVisibleColumns,
                            }}
                            rowCount={3}
                            // renderCellValue={({ rowIndex, colIndex }) => `${tableData[rowIndex].node[colIndex===0 ? "subscriptionId" : "description"]}`}
                            renderCellValue={RenderCellValue}
                        />
                    </DataContext.Provider>
                </EuiPanel>
            )}
        </>
    );
}

export default SubscriptionsGrid;
