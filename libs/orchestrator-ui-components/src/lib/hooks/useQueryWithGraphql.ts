import { useContext } from 'react';
import { GraphQLClient, request } from 'graphql-request';
import { useQuery } from 'react-query';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Variables } from 'graphql-request/build/cjs/types';

import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';

export const useQueryWithGraphql = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
) => {
    const { graphqlEndpointPythia: graphqlEndpoint } = useContext(
        OrchestratorConfigContext,
    );
    const graphQLClient = new GraphQLClient(graphqlEndpoint);

    const fetchFromGraphql = async () => {
        // TS-Ignore because queryVars does not seem to be accepted by the client
        // The props in this useQueryWithGraphql-hook ensures queryVars is indeed related to the query
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await graphQLClient.request(query, queryVars);
    };

    return useQuery(
        ['subscriptions', ...Object.values(queryVars)],
        fetchFromGraphql,
    );
};

export const useStringQueryWithGraphql = <T, U extends Variables>(
    query: string,
    queryVars: U,
    queryKey: string,
    useCoreConnection = false,
) => {
    const { graphqlEndpointPythia, graphqlEndpointCore } = useContext(
        OrchestratorConfigContext,
    );

    const graphqlEndpoint = useCoreConnection
        ? graphqlEndpointCore
        : graphqlEndpointPythia;

    const fetchFromGraphql = async () => {
        return await request<T>(graphqlEndpoint, query, queryVars);
    };

    return useQuery([queryKey, ...Object.values(queryVars)], fetchFromGraphql);
};
