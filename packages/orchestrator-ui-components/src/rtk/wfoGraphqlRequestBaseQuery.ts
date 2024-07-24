import { ClientError, GraphQLClient } from 'graphql-request';
import { signOut } from 'next-auth/react';

import { BaseQueryFn } from '@reduxjs/toolkit/query';
import {
    ErrorResponse,
    GraphqlRequestBaseQueryArgs,
    PrepareHeaders,
    RequestHeaders,
} from '@rtk-query/graphql-request-base-query/dist/GraphqlBaseQueryTypes';

import { stripUndefined } from '@/rtk/utils';
import { GraphqlQueryVariables } from '@/types';

export const utils = <T, E = ErrorResponse>(
    options: GraphqlRequestBaseQueryArgs<E>,
    authActive: boolean,
): BaseQueryFn<
    { document: string; variables?: GraphqlQueryVariables<T> },
    unknown,
    E,
    Partial<Pick<ClientError, 'request' | 'response'>>
> => {
    const client =
        'client' in options
            ? options.client
            : new GraphQLClient(options.url, { errorPolicy: 'all' });

    const requestHeaders: RequestHeaders = options.requestHeaders ?? {};

    return async (
        { document, variables },
        { getState, endpoint, forced, type, extra },
    ) => {
        try {
            const prepareHeaders: PrepareHeaders =
                options.prepareHeaders ?? ((x) => x);
            // Ensure we are passing a valid object to the Headers constructor
            const strippedHeaders = stripUndefined(requestHeaders);
            const headers = new Headers(strippedHeaders as HeadersInit);
            const preparedHeaders = await prepareHeaders(headers, {
                getState,
                endpoint,
                forced,
                type,
                extra,
            });

            const { data, errors } = await client.rawRequest(
                document,
                variables,
                preparedHeaders,
            );

            if (errors?.length && authActive) {
                errors.map((error) => {
                    if (error.extensions?.error_type === 'not_authenticated') {
                        signOut();
                    }
                });
            }

            return {
                data: data,
                errors: errors,
                meta: {},
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const { name, message, stack, request, response } = error;
                const customErrors =
                    options.customErrors ?? (() => ({ name, message, stack }));
                const customizedErrors = customErrors(error) as E;
                return { error: customizedErrors, meta: { request, response } };
            }
            throw error;
        }
    };
};
