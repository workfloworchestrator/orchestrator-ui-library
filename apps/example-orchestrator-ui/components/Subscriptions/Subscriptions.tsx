import {
    getStatusBadgeColor,
    Table,
    TableColumns,
    useQueryWithGraphql,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC } from 'react';
import { EuiBadge } from '@elastic/eui';
import {
    MyBaseSubscriptionEdge,
    SubscriptionGridQuery,
    SubscriptionsSort,
} from '../../__generated__/graphql';
import {
    GET_SUBSCRIPTIONS_PAGINATED,
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
    getFlippedSortOrderValue,
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

export const Subscriptions: FC<SubscriptionsProps> = (props) => {
    const router = useRouter();
    const { isLoading, data } = useQueryWithGraphql(
        GET_SUBSCRIPTIONS_PAGINATED,
        {
            ...GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
            first: props.pageSize,
            after: props.pageIndex,
            sortBy: props.sortOrder,
        },
    );

    if (isLoading || !data) {
        return <h1>Loading...</h1>;
    }

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

    const columnOrder: Array<keyof Subscription> = [
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
            <button onClick={() => props.setPageSize(props.pageSize + 1)}>
                [+1]
            </button>
            <button onClick={() => props.setPageSize(props.pageSize - 1)}>
                [-1]
            </button>
            <button
                onClick={() =>
                    props.setSortOrder({
                        ...props.sortOrder,
                        order: getFlippedSortOrderValue(props.sortOrder.order),
                    })
                }
            >
                [Flip sort order]
            </button>

            <Table
                data={mapApiResponseToSubscriptionTableData(data)}
                columns={tableColumnConfig}
                columnOrder={columnOrder}
                handleRowClick={({ subscriptionId }) =>
                    router.push(`/subscriptions/${subscriptionId}`)
                }
            ></Table>
        </>
    );
};

const mapApiResponseToSubscriptionTableData = (
    graphqlResponse: SubscriptionGridQuery,
): Subscription[] =>
    graphqlResponse.subscriptions.edges.map(
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
