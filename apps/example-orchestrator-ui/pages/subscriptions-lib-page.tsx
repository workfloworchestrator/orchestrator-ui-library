import React from 'react';
import {
    getStatusBadgeColor,
    Subscriptions,
    TableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import NoSSR from 'react-no-ssr';
import {
    MyBaseSubscriptionEdge,
    SubscriptionGridQuery,
} from '../__generated__/graphql';
import { EuiBadge } from '@elastic/eui';
import Link from 'next/link';
import {
    GET_SUBSCRIPTIONS_PAGINATED,
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
} from '../components/Subscriptions/subscriptionsQuery';

type Subscription = {
    subscriptionId: string;
    description: string;
    status: string;
    insync: boolean;
    startDate: string;
    productName: string;
    organisationAbbreviation: string;
};

export default function SubscriptionsPage() {
    // Config per column
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

    // You might not want to convert, flatten or ignore data from the api
    // This mapper converts from the api response (SubscriptionGridQuery)
    // to the self defined type above (Subscription)
    const mapApiResponseToTableData = (
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
                    organisationAbbreviation: organisation.abbreviation,
                    productName: product.name,
                    startDate,
                    status,
                    subscriptionId,
                };
            },
        );

    return (
        <NoSSR>
            <Subscriptions
                tableColumns={tableColumnConfig}
                columnVisibility={columnVisibility}
                query={GET_SUBSCRIPTIONS_PAGINATED}
                queryVars={GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES}
                mapApiResponseToTableData={mapApiResponseToTableData}
            ></Subscriptions>
        </NoSSR>
    );
}
