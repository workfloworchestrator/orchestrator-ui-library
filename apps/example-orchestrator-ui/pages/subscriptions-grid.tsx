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
    EuiText,
} from '@elastic/eui';

import { getStatusBadgeColor } from '@orchestrator-ui/orchestrator-ui-components';

import { useQuery } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { graphql } from '../__generated__';

import { GRAPHQL_ENDPOINT } from '../constants';
import { PythiaSortOrder, SubscriptionsSort } from '../__generated__/graphql';
import {
    NumberParam,
    useQueryParam,
    withDefault,
    StringParam,
} from 'use-query-params';
import { SearchBar } from '../components/searchBar';
import NoSSR from 'react-no-ssr';

const DataContext = createContext(null);

const GET_SUBSCRIPTIONS_PAGINATED = graphql(`
    query SubscriptionGrid(
        $first: Int!
        $after: Int!
        $sortBy: [SubscriptionsSort!]
        $filterBy: [[String!]!]
    ) {
        subscriptions(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
        ) {
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
                    organisation {
                        abbreviation
                        name
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

const columns: Array<EuiDataGridColumn> = [
    {
        id: 'node.subscriptionId',
        displayAsText: 'ID',
        initialWidth: 100,
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
        initialWidth: 350,
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.product.name',
        displayAsText: 'Product',
        initialWidth: 120,
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.organisation.name',
        displayAsText: 'Customer Name',
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.organisation.abbreviation',
        displayAsText: 'Customer',
        initialWidth: 150,
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.status',
        displayAsText: 'Status',
        initialWidth: 80,
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.insync',
        displayAsText: 'In sync?',
        initialWidth: 75,
        // defaultSortDirection: 'asc',
    },
    {
        id: 'node.startDate',
        displayAsText: 'Start date',
        // defaultSortDirection: 'asc',
    },
];

const defaultVisibleColumns = [
    'node.subscriptionId',
    'node.description',
    'node.product.name',
    'node.organisation.abbreviation',
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
        // @ts-ignore
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
            case 'node.organisation.name':
                return data[rowIndex].node['organisation']['name'];
            case 'node.organisation.abbreviation':
                return data[rowIndex].node['organisation']['abbreviation'];
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

const DEFAULT_PAGE_SIZE = 20;

const GRID_STYLE_1 = {
    border: 'horizontal',
    stripes: true,
    rowHover: 'highlight',
    header: 'underline',
    // If showDisplaySelector.allowDensity={true} from toolbarVisibility, fontSize and cellPadding will be superceded by what the user decides.
    cellPadding: 's',
    fontSize: 's',
    footer: 'overline',
    density: 'compact',
};
const GRID_STYLE_2 = {
    border: 'none',
    stripes: true,
    rowHover: 'warning',
    header: 'underline',
    // If showDisplaySelector.allowDensity={true} from toolbarVisibility, fontSize and cellPadding will be superceded by what the user decides.
    cellPadding: 'm',
    fontSize: 'm',
    footer: 'overline',
};
const GRID_STYLE_3 = {
    // DEFAULT
};

const GRID_STYLES = [GRID_STYLE_1, GRID_STYLE_2, GRID_STYLE_3];

function getOrderString(sortOrder: SubscriptionsSort[]) {
    return `${sortOrder[0].field}:${sortOrder[0].order}`;
}

export function SubscriptionsGrid() {
    const defaultSortOrder: SubscriptionsSort[] = [
        { field: 'startDate', order: PythiaSortOrder.Desc },
    ];
    const [pageSize, setPageSize] = useQueryParam(
        'size',
        withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    );
    const [pageIndex, setPageIndex] = useQueryParam(
        'index',
        withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    );
    const [sortOrder, setSortOrder] = useState(defaultSortOrder);
    const [sortOrderUrl, setSortOrderUrl] = useQueryParam(
        'sort',
        withDefault(StringParam, getOrderString(defaultSortOrder)),
    );
    const [searchPhrase, setSearchPhrase] = useQueryParam(
        'search',
        withDefault(StringParam, ''),
    );

    const cleanUp = (value: string) => {
        console.log('originalValue:', value);
        for (const v of value.split(' ')) {
            if (!v.includes(':')) {
                console.log('cleanedUp:', v);
                return v;
            }
        }
        return '';
    };

    const [filterBy, setFilterBy] = useState([
        'description',
        cleanUp(searchPhrase),
    ]);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const handleSearch = (value: any) => {
        console.log(value);
        // eslint-disable-next-line no-prototype-builtins
        if (value.hasOwnProperty('text')) {
            setSearchPhrase(value.text);
            setFilterBy(['description', cleanUp(value.text)]);
        }
    };

    // Todo: Don't ask me why for the numbers here + we should recalculate on density change.
    //  Or adapt density automatically to screenwidth:
    const gridHeight = pageSize * 24 + 37;
    // console.log("gridHeight: ", gridHeight)

    const fetchSubscriptions = async () => {
        return await graphQLClient.request(GET_SUBSCRIPTIONS_PAGINATED, {
            first: pageSize,
            after: pageIndex,
            sortBy: sortOrder,
            filterBy: filterBy,
        });
    };
    const { isLoading, error, data } = useQuery(
        ['subscriptions', pageSize, pageIndex, sortOrder, filterBy],
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
            const temp = [{ field: 'startDate', order: PythiaSortOrder.Asc }];
            console.log('sortOrderUrl', sortOrderUrl);
            setSortOrder(temp);
            setSortOrderUrl(getOrderString(temp));
        } else {
            setSortOrder(defaultSortOrder);
            setSortOrderUrl(getOrderString(defaultSortOrder));
        }
    };

    // const toggleGrid = () => {
    //     setGridStyle(gridStyle >= 2 ? 0 : gridStyle + 1);
    // };

    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
    return (
        <NoSSR>
            <EuiFlexGroup alignItems={'center'}>
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
                {pageIndex >= 1 && (
                    <EuiFlexItem grow={false}>
                        <EuiButtonIcon
                            iconType="arrowLeft"
                            onClick={() => setPageIndex(pageIndex - pageSize)}
                        ></EuiButtonIcon>
                    </EuiFlexItem>
                )}
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        iconType="arrowRight"
                        onClick={() => setPageIndex(pageIndex + pageSize)}
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
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        iconType={'sortable'}
                        onClick={toggleSortOrder}
                    ></EuiButtonIcon>
                </EuiFlexItem>
                <EuiFlexItem>
                    <SearchBar
                        searchPhrase={searchPhrase}
                        handleSearch={handleSearch}
                    ></SearchBar>
                </EuiFlexItem>
                {/*<EuiFlexItem grow={false}>*/}
                {/*    <EuiButtonIcon*/}
                {/*        iconType={'color'}*/}
                {/*        onClick={toggleGrid}*/}
                {/*    ></EuiButtonIcon>*/}
                {/*</EuiFlexItem>*/}
            </EuiFlexGroup>
            {!isLoading && data && (
                <DataContext.Provider value={tableData}>
                    <div css={{ height: gridHeight, marginTop: 12 }}>
                        <EuiDataGrid
                            aria-labelledby={'Subscription grid'}
                            gridStyle={GRID_STYLES[0]}
                            toolbarVisibility={false}
                            columns={columns}
                            columnVisibility={{
                                visibleColumns,
                                setVisibleColumns,
                            }}
                            // rowHeightsOptions={{defaultHeight: 120}}
                            rowCount={pageSize}
                            // renderCellValue={({ rowIndex, colIndex }) => `${tableData[rowIndex].node[colIndex===0 ? "subscriptionId" : "description"]}`}
                            renderCellValue={RenderCellValue}
                        />
                    </div>
                </DataContext.Provider>
            )}
        </NoSSR>
    );
}

export default SubscriptionsGrid;
