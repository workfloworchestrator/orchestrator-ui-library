import { Table, TableColumns } from './Table';
import { Variables } from 'graphql-request/build/cjs/types';
import React from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useGraphql } from '../../hooks/useGraphql';

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
    const { isLoading, data } = useGraphql(query, queryVars);

    if (isLoading || !data) {
        return <h1>Loading...</h1>;
    }

    const convertedData: T[] = mapApiResponseToTableData(data);

    return <Table data={convertedData} columns={tableColumns}></Table>;
};
