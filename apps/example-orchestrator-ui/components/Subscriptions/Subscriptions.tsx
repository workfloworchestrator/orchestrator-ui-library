import {
    getStatusBadgeColor,
    Table,
    TableColumns,
    useQueryWithGraphql,
} from '@orchestrator-ui/orchestrator-ui-components';
import React from 'react';
import { EuiBadge } from '@elastic/eui';
import Link from 'next/link';
import {
    MyBaseSubscriptionEdge,
    SubscriptionGridQuery,
} from '../../__generated__/graphql';
import {
    GET_SUBSCRIPTIONS_PAGINATED,
    GET_SUBSCRIPTIONS_PAGINATED_VARIABLES,
} from './subscriptionsQuery';

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

export const Subscriptions = () => {
    const { isLoading, data } = useQueryWithGraphql(
        GET_SUBSCRIPTIONS_PAGINATED,
        GET_SUBSCRIPTIONS_PAGINATED_VARIABLES,
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
            renderCell: (cellValue) => (
                <Link href={`/subscriptions/${cellValue}`}>
                    {cellValue.slice(0, 8)}
                </Link>
            ),
        },
    };

    const columnVisibility: Array<keyof Subscription> = [
        'subscriptionId',
        'description',
        'productName',
        'organisationAbbreviation',
        'status',
        'insync',
        'startDate',
    ];

    return (
        <Table
            data={mapApiResponseToSubscriptionTableData(data)}
            columns={tableColumnConfig}
            columnVisibility={columnVisibility}
        ></Table>
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
