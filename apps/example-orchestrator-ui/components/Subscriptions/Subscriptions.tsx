import {
    SortDirection,
    Table,
    TableColumns,
    useQueryWithGraphql,
    getTypedFieldFromObject,
    CheckmarkCircleFill,
    MinusCircleOutline,
    useOrchestratorTheme,
    SubscriptionStatusBadge,
    ControlColumn,
    PlusCircleFill,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC } from 'react';
import {
    PythiaSortOrder,
    SubscriptionGridQuery,
    SubscriptionsSort,
} from '../../__generated__/graphql';
import {
    GET_SUBSCRIPTIONS_PAGINATED,
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
} from './subscriptionsQuery';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { EuiFlexItem } from '@elastic/eui';

type Subscription = {
    subscriptionId: string;
    description: string | null;
    status: string | null;
    insync: boolean | null;
    startDate: string | null;
    endDate: string | null;
    productName: string | null;
    tag: string | null;
    organisationName: string | null;
    organisationAbbreviation: string | null;
    notes: string | null;
};

type SubscriptionsProps = {
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
                cellValue
                    ? new Date(parseInt(cellValue) * 1000).toLocaleString(
                          'nl-NL',
                      )
                    : '',
        },
        endDate: {
            displayAsText: 'End Date',
            initialWidth: 150,
            renderCell: (cellValue) =>
                // Todo: determine if this renders the date correctly with respect to timezones
                cellValue
                    ? new Date(parseInt(cellValue) * 1000).toLocaleString(
                          'nl-NL',
                      )
                    : '',
        },
        status: {
            displayAsText: 'Status',
            initialWidth: 110,
            renderCell: (cellValue) =>
                cellValue && (
                    <SubscriptionStatusBadge subscriptionStatus={cellValue} />
                ),
        },
        subscriptionId: {
            displayAsText: 'ID',
            initialWidth: 100,
            renderCell: (cellValue) => cellValue.slice(0, 8),
        },
        notes: {
            displayAsText: 'Notes',
            renderCell: (cellValue) => (cellValue ? cellValue : ''),
        },
    };

    const sortedColumnId = getTypedFieldFromObject(
        sortOrder.field,
        tableColumnConfig,
    );

    const { isLoading, data } = useQueryWithGraphql(
        GET_SUBSCRIPTIONS_PAGINATED,
        {
            ...GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
            first: pageSize,
            after: pageIndex,
            sortBy: sortedColumnId && {
                field: sortedColumnId.toString(),
                order: sortOrder.order,
            },
        },
    );

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
        'notes',
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

    return (
        <Table
            data={mapApiResponseToSubscriptionTableData(data)}
            pagination={{
                pageSize: pageSize,
                pageIndex: Math.floor(pageIndex / pageSize),
                pageSizeOptions: [5, 10, 15, 20, 25, 100], // todo move to constants file
                totalRecords: 300, // todo get from graphql result
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
                sortDirection: mapToSortDirection(sortOrder.order),
            }}
            updateDataSorting={(dataSorting) =>
                setSortOrder({
                    field: dataSorting.columnId,
                    order:
                        dataSorting.sortDirection === SortDirection.Asc
                            ? PythiaSortOrder.Asc
                            : PythiaSortOrder.Desc,
                })
            }
        ></Table>
    );
};

function mapApiResponseToSubscriptionTableData(
    graphqlResponse: SubscriptionGridQuery,
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
                organisationName: organisation?.name ?? null,
                organisationAbbreviation: organisation?.abbreviation ?? null,
                productName: product.name,
                tag: product.tag ?? null,
                startDate: startDate ?? null,
                endDate: endDate ?? null,
                status,
                subscriptionId,
                notes: note ?? null,
            };
        },
    );
}

function mapToSortDirection(sortOrder?: PythiaSortOrder): SortDirection {
    return sortOrder === PythiaSortOrder.Asc
        ? SortDirection.Asc
        : SortDirection.Desc;
}
