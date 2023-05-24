import {
    Table,
    TableColumns,
    getTypedFieldFromObject,
    CheckmarkCircleFill,
    MinusCircleOutline,
    useOrchestratorTheme,
    SubscriptionStatusBadge,
    ControlColumn,
    PlusCircleFill,
    useStringQueryWithGraphql,
    parseDate,
    TableTable,
    TableHeaderCell,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { EuiFlexItem, EuiBasicTableColumn } from '@elastic/eui';
import {
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
    GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT,
    SubscriptionsQueryVariables,
    SubscriptionsResult,
    SubscriptionsSort,
} from './subscriptionQuery';

type Subscription = {
    subscriptionId: string;
    description: string;
    status: string;
    insync: boolean;
    startDate: Date | null;
    endDate: Date | null;
    productName: string;
    tag: string | null;
    organisationName: string | null;
    organisationAbbreviation: string | null;
    note: string | null;
};

export type SubscriptionsProps = {
    pageSize: number;
    setPageSize: (updatedPageSize: number) => void;
    pageIndex: number;
    setPageIndex: (updatedPageIndex: number) => void;
    sortOrder: SubscriptionsSort;
    setSortOrder: (updatedSortOrder: SubscriptionsSort) => void;
};

export const Subscriptions: FC<SubscriptionsProps> = ({
    pageSize,
    pageIndex,
    sortOrder,
    setPageSize,
    setPageIndex,
    setSortOrder,
}) => {
    const router = useRouter();
    const { theme } = useOrchestratorTheme();

    const tableColumnConfig: TableColumns<Subscription> = {
        description: {
            displayAsText: 'Description',
            initialWidth: 400,
            renderCell: (cellValue, row) => (
                <Link href={`/subscriptions/${row.subscriptionId}`}>
                    {cellValue}
                </Link>
            ),
        },
        insync: {
            displayAsText: 'In Sync',
            initialWidth: 110,
            renderCell: (cellValue) =>
                cellValue ? (
                    <CheckmarkCircleFill color={theme.colors.primary} />
                ) : (
                    <MinusCircleOutline color={theme.colors.mediumShade} />
                ),
        },
        organisationName: {
            displayAsText: 'Customer Name',
            isHiddenByDefault: true,
        },
        organisationAbbreviation: {
            displayAsText: 'Customer',
            initialWidth: 200,
        },
        productName: {
            displayAsText: 'Product',
            initialWidth: 250,
            isHiddenByDefault: true,
        },
        tag: {
            initialWidth: 100,
            displayAsText: 'Tag',
        },
        startDate: {
            displayAsText: 'Start Date',
            initialWidth: 150,
            renderCell: (cellValue) =>
                // Todo: determine if this renders the date correctly with respect to timezones
                cellValue ? cellValue.toLocaleString('nl-NL') : '',
        },
        endDate: {
            displayAsText: 'End Date',
            initialWidth: 150,
            renderCell: (cellValue) =>
                // Todo: determine if this renders the date correctly with respect to timezones
                cellValue ? cellValue.toLocaleString('nl-NL') : '',
        },
        status: {
            displayAsText: 'Status',
            initialWidth: 110,
            renderCell: (cellValue) => (
                <SubscriptionStatusBadge subscriptionStatus={cellValue} />
            ),
        },
        subscriptionId: {
            displayAsText: 'ID',
            initialWidth: 100,
            renderCell: (cellValue) => cellValue.slice(0, 8),
        },
        note: {
            displayAsText: 'Note',
            renderCell: (cellValue) => (cellValue ? cellValue : ''),
        },
    };

    const sortedColumnId = getTypedFieldFromObject(
        sortOrder.field,
        tableColumnConfig,
    );

    const { isLoading, data } = useStringQueryWithGraphql<
        SubscriptionsResult,
        SubscriptionsQueryVariables
    >(GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT, {
        ...GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
        first: pageSize,
        after: pageIndex,
        sortBy: sortedColumnId && {
            field: sortedColumnId.toString(),
            order: sortOrder.order,
        },
    });

    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return null;
    }

    if (isLoading || !data) {
        return <h1>Loading...</h1>;
    }

    const initialColumnOrder: Array<keyof Subscription> = [
        'subscriptionId',
        'description',
        'status',
        'insync',
        'organisationName',
        'organisationAbbreviation',
        'productName',
        'tag',
        'startDate',
        'endDate',
        'note',
    ];

    const leadingControlColumns: ControlColumn<Subscription>[] = [
        {
            id: 'inlineSubscriptionDetails',
            width: 40,
            rowCellRender: () => (
                <EuiFlexItem>
                    <PlusCircleFill color={theme.colors.mediumShade} />
                </EuiFlexItem>
            ),
        },
    ];

    // Todo hidden cols are commented out for now
    const tableTableConfig: EuiBasicTableColumn<Subscription>[] = [
        // control column:
        {
            field: 'inlineSubscriptionDetails',
            width: '40',
            render: () => (
                <EuiFlexItem>
                    <PlusCircleFill color={theme.colors.mediumShade} />
                </EuiFlexItem>
            ),
        },
        // data columns:
        {
            field: 'subscriptionId',
            name: <TableHeaderCell>ID</TableHeaderCell>,
            sortable: true,
            render: (value: string) => value.slice(0, 8),
            width: '100',
            truncateText: true,
        },
        {
            field: 'description',
            name: <TableHeaderCell>Description</TableHeaderCell>,
            render: (value: string, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
            width: '400',
            truncateText: true,
        },
        {
            field: 'status',
            name: <TableHeaderCell>Status</TableHeaderCell>,
            render: (value: string) => (
                <SubscriptionStatusBadge subscriptionStatus={value} />
            ),
            width: '110',
            truncateText: true,
        },
        {
            field: 'insync',
            name: <TableHeaderCell>In Sync</TableHeaderCell>,
            render: (value: boolean) =>
                value ? (
                    <CheckmarkCircleFill color={theme.colors.primary} />
                ) : (
                    <MinusCircleOutline color={theme.colors.mediumShade} />
                ),
            width: '110',
            truncateText: true,
        },
        // {
        //     field: 'organisationName',
        //     name: 'Customer Name',
        //     truncateText: true,
        // },
        {
            field: 'organisationAbbreviation',
            name: <TableHeaderCell>Customer</TableHeaderCell>,
            width: '200',
            truncateText: true,
        },
        // {
        //     field: 'productName',
        //     name: 'Product',
        //     truncateText: true,
        // },
        {
            field: 'tag',
            name: <TableHeaderCell>Tag</TableHeaderCell>,
            width: '100',
            truncateText: true,
        },
        {
            field: 'startDate',
            name: <TableHeaderCell>Start Date</TableHeaderCell>,
            render: (value: Date | null) =>
                value ? value.toLocaleString('nl-NL') : '',
            width: '150',
            truncateText: true,
        },
        {
            field: 'endDate',
            name: <TableHeaderCell>End Date</TableHeaderCell>,
            render: (value: Date | null) =>
                value ? value.toLocaleString('nl-NL') : '',
            width: '150',
            truncateText: true,
        },
        {
            field: 'note',
            name: <TableHeaderCell>Note</TableHeaderCell>,
            truncateText: true,
        },
    ];

    return (
        <>
            <h1>Table:</h1>
            <TableTable
                data={mapApiResponseToSubscriptionTableData(data)}
                columns={tableTableConfig}
                pagination={{
                    pageSize: pageSize,
                    pageIndex: Math.floor(pageIndex / pageSize),
                    pageSizeOptions: [5, 10, 15, 20, 25, 100],
                    totalItemCount: parseInt(
                        data.subscriptions.pageInfo.totalItems,
                    ),
                }}
                onCriteriaChange={(criteria) =>
                    console.log('Criteria changed', { criteria })
                }
            />
            <h1>GRID:</h1>
            <Table
                data={mapApiResponseToSubscriptionTableData(data)}
                pagination={{
                    pageSize: pageSize,
                    pageIndex: Math.floor(pageIndex / pageSize),
                    pageSizeOptions: [5, 10, 15, 20, 25, 100],
                    totalRecords: parseInt(
                        data.subscriptions.pageInfo.totalItems,
                    ),
                    onChangePage: (updatedPageNumber) =>
                        setPageIndex(updatedPageNumber * pageSize),
                    onChangeItemsPerPage: (itemsPerPage) =>
                        setPageSize(itemsPerPage),
                }}
                columns={tableColumnConfig}
                leadingControlColumns={leadingControlColumns}
                initialColumnOrder={initialColumnOrder}
                dataSorting={{
                    columnId: sortedColumnId,
                    sortDirection: sortOrder.order,
                }}
                updateDataSorting={(dataSorting) =>
                    setSortOrder({
                        field: dataSorting.columnId,
                        order: dataSorting.sortDirection,
                    })
                }
            ></Table>
        </>
    );
};

function mapApiResponseToSubscriptionTableData(
    graphqlResponse: SubscriptionsResult,
): Subscription[] {
    return graphqlResponse.subscriptions.edges.map(
        (baseSubscription): Subscription => {
            const {
                description,
                insync,
                organisation,
                product,
                startDate,
                endDate,
                status,
                subscriptionId,
                note,
            } = baseSubscription.node;

            return {
                description,
                insync,
                organisationName: organisation.name ?? null,
                organisationAbbreviation: organisation.abbreviation ?? null,
                productName: product.name,
                tag: product.tag ?? null,
                startDate: parseDate(startDate),
                endDate: parseDate(endDate),
                status,
                subscriptionId,
                note,
            };
        },
    );
}
