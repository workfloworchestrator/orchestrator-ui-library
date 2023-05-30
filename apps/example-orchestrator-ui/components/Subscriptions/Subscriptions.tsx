import {
    CheckmarkCircleFill,
    getTypedFieldFromObject,
    MinusCircleOutline,
    parseDate,
    PlusCircleFill,
    SortDirection,
    SubscriptionStatusBadge,
    TableTable,
    TableTableColumns,
    TableTableColumnsWithExtraNonDataFields,
    useOrchestratorTheme,
    useStringQueryWithGraphql,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { EuiFlexItem } from '@elastic/eui';
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
    const [hiddenColumns /*, setHiddenColumns*/] = useState<
        Array<keyof Subscription>
    >(['organisationName', 'productName']);

    const tableTableColumns: TableTableColumns<Subscription> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: 'ID',
            width: '100',
            render: (value: string) => value.slice(0, 8),
        },
        description: {
            field: 'description',
            name: 'Description',
            width: '400',
            render: (value: string, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: 'status',
            name: 'Status',
            width: '110',
            render: (value: string) => (
                <SubscriptionStatusBadge subscriptionStatus={value} />
            ),
        },
        insync: {
            field: 'insync',
            name: 'In Sync',
            width: '110',
            render: (value: boolean) =>
                value ? (
                    <CheckmarkCircleFill color={theme.colors.primary} />
                ) : (
                    <MinusCircleOutline color={theme.colors.mediumShade} />
                ),
        },
        organisationName: {
            field: 'organisationName',
            name: 'Customer Name',
        },
        organisationAbbreviation: {
            field: 'organisationAbbreviation',
            name: 'Customer',
            width: '200',
        },
        productName: {
            field: 'productName',
            name: 'Product',
        },
        tag: {
            field: 'tag',
            name: 'Tag',
            width: '100',
        },
        startDate: {
            field: 'startDate',
            name: 'Start Date',
            width: '150',
            render: (value: Date | null) =>
                value ? value.toLocaleString('nl-NL') : '',
        },
        endDate: {
            field: 'endDate',
            name: 'End Date',
            width: '150',
            render: (value: Date | null) =>
                value ? value.toLocaleString('nl-NL') : '',
        },
        note: {
            field: 'note',
            name: 'Note',
        },
    };

    const tableTableColumnsWithExtraNonDataFields: TableTableColumnsWithExtraNonDataFields<Subscription> =
        {
            inlineSubscriptionDetails: {
                field: 'inlineSubscriptionDetails',
                width: '40',
                render: () => (
                    <EuiFlexItem>
                        <PlusCircleFill color={theme.colors.mediumShade} />
                    </EuiFlexItem>
                ),
            },
            ...tableTableColumns,
        };

    const sortedColumnId = getTypedFieldFromObject(
        sortOrder.field,
        tableTableColumns,
    );

    const { data, isFetching } = useStringQueryWithGraphql<
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

    if (!data) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <TableTable
                data={mapApiResponseToSubscriptionTableData(data)}
                columns={tableTableColumnsWithExtraNonDataFields}
                hiddenColumns={hiddenColumns}
                dataSorting={{
                    columnId: sortedColumnId,
                    sortDirection: sortOrder.order,
                }}
                onDataSort={(newSortColumnId) =>
                    setSortOrder({
                        field: newSortColumnId,
                        order: determineNewSortOrder(
                            sortedColumnId,
                            sortOrder.order,
                            newSortColumnId,
                        ),
                    })
                }
                pagination={{
                    pageSize: pageSize,
                    pageIndex: Math.floor(pageIndex / pageSize),
                    pageSizeOptions: [5, 10, 15, 20, 25, 100],
                    totalItemCount: parseInt(
                        data.subscriptions.pageInfo.totalItems,
                    ),
                }}
                isLoading={isFetching}
                onCriteriaChange={(criteria) => {
                    const { page } = criteria;
                    if (page) {
                        const { index, size } = page;
                        setPageSize(size);
                        setPageIndex(index * size);
                    }
                }}
            />
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

function determineNewSortOrder<T>(
    currentSortColumnId: keyof T,
    currentSortDirection: SortDirection,
    newSortColumnId: keyof T,
) {
    if (currentSortColumnId === newSortColumnId) {
        return currentSortDirection === SortDirection.Asc
            ? SortDirection.Desc
            : SortDirection.Asc;
    }

    return SortDirection.Asc;
}
