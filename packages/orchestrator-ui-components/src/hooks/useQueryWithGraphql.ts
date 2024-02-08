import { useContext } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

import { GraphQLClient } from 'graphql-request';
import type { Variables } from 'graphql-request/build/esm/types';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { OrchestratorConfigContext } from '@/contexts';

import { useWfoSession } from './useSessionWithToken';

export const useQueryWithGraphql = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
    cacheKeys: string[] | string,
    options: UseQueryOptions<U> = {},
) => {
    const { graphqlEndpointCore } = useContext(OrchestratorConfigContext);
    const { session } = useWfoSession();

    const graphQLClient = new GraphQLClient(graphqlEndpointCore);

    const requestHeaders = {
        Authorization: session ? `Bearer ${session.accessToken}` : '',
    };

    const fetchFromGraphql = async () =>
        // TS-Ignore because queryVars does not seem to be accepted by the client
        // The props in this useQueryWithGraphql-hook ensures queryVars is indeed related to the query
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await graphQLClient.request<U, V>(query, queryVars, requestHeaders);

    const queryKeys = [
        ...(typeof cacheKeys === 'string' ? [cacheKeys] : cacheKeys),
        ...Object.values(queryVars),
    ];

    const { error, ...restWithoutError } = useQuery<U>({
        queryKey: queryKeys,
        queryFn: fetchFromGraphql,
        ...options,
    });

    if (error) {
        console.error(error);
    }
    return restWithoutError;
};

export const useQueryWithGraphqlLazy = <U, V extends Variables>(
    query: TypedDocumentNode<U, V>,
    queryVars: V,
    cacheKeys: string[] | string,
    options: UseQueryOptions<U> = {},
) => {
    // Disabling the query prevent the initial fetch
    const queryWithGraphql = useQueryWithGraphql(query, queryVars, cacheKeys, {
        ...options,
        enabled: false,
    });

    // Calling getData fetches the data
    return {
        getData: async () => {
            const result = await queryWithGraphql.refetch();
            return result.data;
        },
        ...queryWithGraphql,
    };
};
