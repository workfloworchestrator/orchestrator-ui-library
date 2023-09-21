import { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Variables } from 'graphql-request/build/cjs/types';
import { useSession } from 'next-auth/react';

import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';

export const useQueryWithGraphql = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
    queryKey: string,
    refetchInterval?: number,
) => {
    const { graphqlEndpointCore } = useContext(OrchestratorConfigContext);
    const graphQLClient = new GraphQLClient(graphqlEndpointCore);
    const { data } = useSession();
    let requestHeaders = {};

    if (data) {
        // not sure how to type this...
        // @ts-ignore
        const { accessToken } = data;

        requestHeaders = {
            authorization: `Bearer ${accessToken}`,
        };
    }

    const fetchFromGraphql = async () =>
        // TS-Ignore because queryVars does not seem to be accepted by the client
        // The props in this useQueryWithGraphql-hook ensures queryVars is indeed related to the query
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await graphQLClient.request(query, queryVars, requestHeaders);

    return useQuery([queryKey, ...Object.values(queryVars)], fetchFromGraphql, {
        refetchInterval,
    });
};
