import { Table, TableColumns } from './Table';
import { GraphQLClient } from 'graphql-request';
import { Variables } from 'graphql-request/build/cjs/types';
import React, { useContext } from 'react';
import { OrchestratorConfigContext } from '../../contexts/OrchestratorConfigContext';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from 'react-query';

export type SubscriptionsProps<T, U, V> = {
    tableColumns: TableColumns<T>;
    query: TypedDocumentNode<U, V>;
    queryVars: V;
    mapApiResponseToTableData: (graphqlResponse: U) => T[];
};

export const Subscriptions = <T, U, V extends Variables>({
    query,
    queryVars,
    tableColumns,
    mapApiResponseToTableData,
}: SubscriptionsProps<T, U, V>) => {
    const { graphqlEndpoint } = useContext(OrchestratorConfigContext);
    const graphQLClient = new GraphQLClient(graphqlEndpoint);

    const fetchSubscriptions = async () => {
        // Todo: avoid ts-ignore

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await graphQLClient.request(query, queryVars);
    };

    const { isLoading, data } = useQuery(
        ['subscriptions', ...Object.values(queryVars)],
        fetchSubscriptions,
    );

    if (isLoading || !data) {
        return <h1>Loading...</h1>;
    }

    const convertedData: T[] = mapApiResponseToTableData(data);

    return <Table data={convertedData} columns={tableColumns}></Table>;
};
