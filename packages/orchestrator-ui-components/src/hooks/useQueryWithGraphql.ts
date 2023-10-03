import { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Variables } from 'graphql-request/build/cjs/types';

import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';

export const useQueryWithGraphql = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
    queryKey: string,
    useCoreConnection = false,
) => {
    const { graphqlEndpointPythia, graphqlEndpointCore } = useContext(
        OrchestratorConfigContext,
    );

    const graphqlEndpoint = useCoreConnection
        ? graphqlEndpointCore
        : graphqlEndpointPythia;

    const graphQLClient = new GraphQLClient(graphqlEndpoint);

    const fetchFromGraphql = async () =>
        // TS-Ignore because queryVars does not seem to be accepted by the client
        // The props in this useQueryWithGraphql-hook ensures queryVars is indeed related to the query
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await graphQLClient.request(query, queryVars);

    // todo : add prop
    return useQuery([queryKey, ...Object.values(queryVars)], fetchFromGraphql, {
        refetchInterval: 3000,
    });
};
