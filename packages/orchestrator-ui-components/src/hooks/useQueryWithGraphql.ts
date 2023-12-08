import { useContext } from 'react';
import { useQuery } from 'react-query';

import { GraphQLClient } from 'graphql-request';
import {
    GraphQLClientRequestHeaders,
    Variables,
} from 'graphql-request/build/cjs/types';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { OrchestratorConfigContext } from '@/contexts';

import { useSessionWithToken } from './useSessionWithToken';

export const useQueryWithGraphql = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
    queryKey: string,
    refetchInterval: number | false = false,
    enabled: boolean = true,
    extraQueryKeys: string[] = [], // todo: replace queryKey with queryKeys -- this is just for testing
) => {
    const { graphqlEndpointCore } = useContext(OrchestratorConfigContext);
    const { session } = useSessionWithToken();

    const graphQLClient = new GraphQLClient(graphqlEndpointCore);

    const requestHeaders: GraphQLClientRequestHeaders = {
        Authorization: session ? `Bearer ${session.accessToken}` : '',
    };

    const fetchFromGraphql = async () =>
        // TS-Ignore because queryVars does not seem to be accepted by the client
        // The props in this useQueryWithGraphql-hook ensures queryVars is indeed related to the query
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await graphQLClient.request<U, V>(query, queryVars, requestHeaders);

    const queryKeys = [
        queryKey,
        ...extraQueryKeys,
        ...Object.values(queryVars),
    ];

    const { error, ...restWithoutError } = useQuery<U>(
        queryKeys,
        fetchFromGraphql,
        {
            refetchInterval,
            enabled,
        },
    );

    if (error) {
        console.error(error);
    }
    return restWithoutError;
};
