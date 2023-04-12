import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Variables } from 'graphql-request/build/cjs/types';

export const useGraphql = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
) => {
    const { graphqlEndpoint } = useContext(OrchestratorConfigContext);
    const graphQLClient = new GraphQLClient(graphqlEndpoint);

    const fetchSubscriptions = async () => {
        // Todo: avoid ts-ignore

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await graphQLClient.request(query, queryVars);
    };

    return useQuery(
        ['subscriptions', ...Object.values(queryVars)],
        fetchSubscriptions,
    );
};
