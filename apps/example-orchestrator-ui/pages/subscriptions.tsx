import React from 'react';
import {
    Subscriptions,
    TableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import NoSSR from 'react-no-ssr';
import { graphql } from '../__generated__';
import { GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '../constants';
import {
    MyBaseSubscription,
    MyBaseSubscriptionEdge,
    PythiaSortOrder,
    SubscriptionsSort,
} from '../__generated__/graphql';
import { useQuery } from 'react-query';

export default function SubscriptionsPage() {
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

    const defaultSortOrder: SubscriptionsSort[] = [
        { field: 'startDate', order: PythiaSortOrder.Desc },
    ];
    const fetchSubscriptions = async () => {
        // @ts-ignore
        return await graphQLClient.request(GET_SUBSCRIPTIONS_PAGINATED, {
            first: 20,
            after: 20,
            sortBy: defaultSortOrder,
        });
    };

    const { isLoading, data } = useQuery(
        ['subscriptions', 20, 20, defaultSortOrder],
        fetchSubscriptions,
    );

    if (isLoading || !data) {
        return <h1>LOADING!</h1>;
    }

    const dataForTable: MyBaseSubscription[] = data.subscriptions.edges.map(
        (aa: MyBaseSubscriptionEdge) => aa.node,
    );

    const tableColumns: TableColumns<MyBaseSubscription> = {
        customerDescriptions: {},
        customerId: {},
        dependsOn: {},
        description: {
            displayAsText: 'Description',
            initialWidth: 400,
            renderCell: (cellValue) => <h1>{cellValue}</h1>,
        },
        endDate: {},
        firewallEnabled: {},
        fixedInputs: {},
        imsCircuits: {},
        inUseBy: {},
        insync: {},
        locations: {},
        minimalImpactNotifications: {},
        name: {},
        note: {},
        organisation: {
            renderCell: ({ name }) => <h1>{name}</h1>,
        },
        portSubscriptionInstanceId: {},
        product: {},
        productBlocks: {},
        startDate: {},
        status: {},
        subscriptionId: {},
        tag: {},
        vlanRange: {},
    };

    return (
        <NoSSR>
            <Subscriptions
                tableData={dataForTable}
                tableColumns={tableColumns}
            ></Subscriptions>
        </NoSSR>
    );
}
