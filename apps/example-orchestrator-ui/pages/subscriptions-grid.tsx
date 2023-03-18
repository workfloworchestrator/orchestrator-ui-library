import 'regenerator-runtime/runtime';
import React, { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import {
    EuiBadge,
    EuiButtonIcon,
    EuiDataGrid,
    EuiDataGridColumn,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner,
    EuiPanel,
    EuiText,
} from '@elastic/eui';

import { getStatusBadgeColor } from '@orchestrator-ui/orchestrator-ui-components';

import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { graphql } from '../__generated__';

import { GRAPHQL_ENDPOINT } from '../constants';
import { PythiaSortOrder, SubscriptionsSort } from '../__generated__/graphql';

const DataContext = createContext();

const GET_SUBSCRIPTIONS_PAGINATED = graphql(`
    query SubscriptionGrid(
        $first: Int!
        $after: Int!
        $sortBy: [SubscriptionsSort!]
    ) {
        subscriptions(first: $first, after: $after, sortBy: $sortBy) {
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
        // defaultSortDirection: 'asc',
        cellActions: [
            ({ rowIndex, columnId, Component }) => {
                // const data = useContext(DataContext);
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
        // Ensure that empty extra rows are not rendered
        if (rowIndex >= data.length) {
            return null;
        }

        const value = data[rowIndex].node[columnId.replace('node.', '')];
        switch (columnId) {
            case 'node.subscriptionId':
                return (
                    <Link href={`/subscriptions/${value}`}>
                        {value.slice(0, 8)}
                    </Link>
                );
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
    // const defaultSortOrder = [{field: "description", order: PythiaSortOrder.Asc}, {field: "startDate", order: PythiaSortOrder.Desc}]
    const defaultSortOrder: SubscriptionsSort[] = [
        { field: 'startDate', order: PythiaSortOrder.Desc },
    ];
    const [pageSize, setPageSize] = useState(50);
    const [pageNumber, setPageNumber] = useState(0);
    const [sortOrder, setSortOrder] = useState(defaultSortOrder);
    const fetchSubscriptions = async () => {
        return await graphQLClient.request(GET_SUBSCRIPTIONS_PAGINATED, {
            first: pageSize,
            after: pageNumber,
            sortBy: sortOrder,
        });
    };
    const { isLoading, error, data } = useQuery(
        ['subscriptions', pageSize, pageNumber, sortOrder],
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

    const toggleSortOrder = () => {
        if (sortOrder[0].order === PythiaSortOrder.Desc) {
            setSortOrder([{ field: 'startDate', order: PythiaSortOrder.Asc }]);
        } else {
            setSortOrder(defaultSortOrder);
        }
    };

    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiText>
                        <h2>Subscriptions</h2>
                    </EuiText>
                </EuiFlexItem>
                {isLoading && (
                    <EuiFlexItem>
                        <EuiLoadingSpinner />
                    </EuiFlexItem>
                )}
                {pageNumber >= 1 && (
                    <EuiFlexItem grow={false}>
                        <EuiButtonIcon
                            iconType="arrowLeft"
                            onClick={() => setPageNumber(pageNumber - pageSize)}
                        ></EuiButtonIcon>
                    </EuiFlexItem>
                )}
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        iconType="arrowRight"
                        onClick={() => setPageNumber(pageNumber + pageSize)}
                    ></EuiButtonIcon>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        iconType="minusInCircle"
                        onClick={() => setPageSize(pageSize - 10)}
                    ></EuiButtonIcon>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        iconType="plusInCircle"
                        onClick={() => setPageSize(pageSize + 10)}
                    ></EuiButtonIcon>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiButtonIcon
                        iconType={'sortable'}
                        onClick={toggleSortOrder}
                    ></EuiButtonIcon>
                </EuiFlexItem>
            </EuiFlexGroup>
            {!isLoading && data && (
                <EuiPanel grow={true}>
                    <DataContext.Provider value={tableData}>
                        <EuiDataGrid
                            columns={columns}
                            columnVisibility={{
                                visibleColumns,
                                setVisibleColumns,
                            }}
                            rowCount={pageSize}
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
