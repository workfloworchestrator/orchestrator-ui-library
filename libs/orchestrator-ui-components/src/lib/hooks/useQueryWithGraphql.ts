import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Variables } from 'graphql-request/build/cjs/types';

export const useQueryWithGraphql = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
) => {
    const { graphqlEndpoint } = useContext(OrchestratorConfigContext);
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
