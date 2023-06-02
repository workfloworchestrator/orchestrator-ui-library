import {
    CheckmarkCircleFill,
    DataSorting,
    DEFAULT_PAGE_SIZES,
    determineNewSortOrder,
    determinePageIndex,
    getTypedFieldFromObject,
    MinusCircleOutline,
    parseDate,
    PlusCircleFill,
    sliceUuid,
    SubscriptionStatusBadge,
    Table,
    TableColumns,
    TableColumnsWithExtraNonDataFields,
    useOrchestratorTheme,
    useStringQueryWithGraphql,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC } from 'react';
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
import { Criteria, Pagination } from '@elastic/eui';

type Subscription = {
    subscriptionId: string;
    description: string;
    status: string;
    insync: boolean;
    startDate: Date | null;
    endDate: Date | null;
    productName: string;
    tag: string | null;
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
    const hiddenColumns: Array<keyof Subscription> = ['productName'];

    const tableColumns: TableColumns<Subscription> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: 'ID',
            width: '100',
            render: (value: string) => sliceUuid(value),
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
                value?.toLocaleString('nl-NL') ?? '',
        },
        endDate: {
            field: 'endDate',
            name: 'End Date',
            width: '150',
            render: (value: Date | null) =>
                value?.toLocaleString('nl-NL') ?? '',
        },
        note: {
            field: 'note',
            name: 'Note',
        },
    };

    const tableColumnsWithExtraNonDataFields: TableColumnsWithExtraNonDataFields<Subscription> =
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
            ...tableColumns,
        };

    const sortedColumnId = getTypedFieldFromObject(
        sortOrder.field,
        tableColumns,
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

    const handleDataSort = (newSortColumnId: keyof Subscription) =>
        setSortOrder({
            field: newSortColumnId,
            order: determineNewSortOrder(
                sortedColumnId,
                sortOrder.order,
                newSortColumnId,
            ),
        });

    const handleCriteriaChange = (criteria: Criteria<Subscription>) => {
        const { page } = criteria;
        if (page) {
            const { index, size } = page;
            setPageSize(size);
            setPageIndex(index * size);
        }
    };

    const totalItemCount = parseInt(data.subscriptions.pageInfo.totalItems);
    const dataSorting: DataSorting<Subscription> = {
        columnId: sortedColumnId,
        sortDirection: sortOrder.order,
    };
    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: determinePageIndex(pageIndex, pageSize),
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItemCount,
    };

    return (
        <Table
            data={mapApiResponseToSubscriptionTableData(data)}
            columns={tableColumnsWithExtraNonDataFields}
            hiddenColumns={hiddenColumns}
            dataSorting={dataSorting}
            onDataSort={handleDataSort}
            pagination={pagination}
            isLoading={isFetching}
            onCriteriaChange={handleCriteriaChange}
        />
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
