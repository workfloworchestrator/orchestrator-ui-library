import {
    getStatusBadgeColor,
    SortDirection,
    Table,
    TableColumns,
    useQueryWithGraphql,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC } from 'react';
import { EuiBadge } from '@elastic/eui';
import {
    MyBaseSubscriptionEdge,
    PythiaSortOrder,
    SubscriptionGridQuery,
    SubscriptionsSort,
} from '../../__generated__/graphql';
import {
    GET_SUBSCRIPTIONS_PAGINATED,
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
} from './subscriptionsQuery';
import { useRouter } from 'next/router';

type Subscription = {
    subscriptionId: string;
    description: string;
    status: string;
    insync: boolean;
    startDate: string;
    productName: string;
    organisationName: string;
    organisationAbbreviation: string;
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

    const tableColumnConfig: TableColumns<Subscription> = {
        description: {
            displayAsText: 'Description',
            initialWidth: 400,
            renderCell: (cellValue) => <h1>{cellValue}</h1>,
        },
        insync: {
            renderCell: (cellValue) => (
                <EuiBadge
                    color={cellValue ? 'success' : 'danger'}
                    isDisabled={false}
                >
                    {cellValue.toString()}
                </EuiBadge>
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
        },
        startDate: {
            renderCell: (cellValue) =>
                cellValue
                    ? new Date(parseInt(cellValue) * 1000).toLocaleString(
                          'nl-NL',
                      )
                    : '',
        },
        status: {
            displayAsText: 'Status',
            renderCell: (cellValue) => (
                <EuiBadge
                    color={getStatusBadgeColor(cellValue)}
                    isDisabled={false}
                >
                    {cellValue}
                </EuiBadge>
            ),
        },
        subscriptionId: {
            displayAsText: 'ID',
            renderCell: (cellValue) => cellValue.slice(0, 8),
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
            sortBy: {
                field: sortedColumnId?.toString(),
                order: sortOrder.order,
            },
        },
    );

    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return;
    }

    if (isLoading || !data) {
        return <h1>Loading...</h1>;
    }

    const initialColumnOrder: Array<keyof Subscription> = [
        'subscriptionId',
        'description',
        'productName',
        'organisationName',
        'organisationAbbreviation',
        'status',
        'insync',
        'startDate',
    ];

    return (
        <>
            {/*Todo remove temporary controls*/}
            <button onClick={() => setPageSize(pageSize + 1)}>[+1]</button>
            <button onClick={() => setPageSize(pageSize - 1)}>[-1]</button>

            <Table
                data={mapApiResponseToSubscriptionTableData(data)}
                columns={tableColumnConfig}
                initialColumnOrder={initialColumnOrder}
                dataSorting={{
                    columnId: sortedColumnId,
                    sortDirection: mapPythiaSortOrderToSortDirection(
                        sortOrder.order,
                    ),
                }}
                handleRowClick={({ subscriptionId }) =>
                    router.push(`/subscriptions/${subscriptionId}`)
                }
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
        </>
    );
};

// todo is there a built in solution in TS for this?
// todo move to lib
function getTypedFieldFromObject<T>(
    field: string,
    object: T,
): undefined | keyof T {
    if (!Object.keys(object).includes(field)) {
        return undefined;
    }
    return field as keyof T;
}

function mapApiResponseToSubscriptionTableData(
    graphqlResponse: SubscriptionGridQuery,
): Subscription[] {
    return graphqlResponse.subscriptions.edges.map(
        (baseSubscription: MyBaseSubscriptionEdge): Subscription => {
            const {
                description,
                insync,
                organisation,
                product,
                startDate,
                status,
                subscriptionId,
            } = baseSubscription.node;

            return {
                description,
                insync,
                organisationName: organisation.name,
                organisationAbbreviation: organisation.abbreviation,
                productName: product.name,
                startDate,
                status,
                subscriptionId,
            };
        },
    );
}

function mapPythiaSortOrderToSortDirection(
    sortOrder: PythiaSortOrder,
): SortDirection {
    return sortOrder === PythiaSortOrder.Asc
        ? SortDirection.Asc
        : SortDirection.Desc;
}
