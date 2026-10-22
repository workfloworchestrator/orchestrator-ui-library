import { ClientError, GraphQLClient } from 'graphql-request';
import type { GraphQLError } from 'graphql/error/GraphQLError.js';
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

const isNotAuthenticated = (errors?: readonly GraphQLError[]) =>
  !!errors?.some((error) => error.extensions?.error_type === 'not_authenticated');

export const wfoGraphqlRequestBaseQuery = <T, E = ErrorResponse>(
  options: GraphqlRequestBaseQueryArgs<E>,
  authActive: boolean,
): BaseQueryFn<
  { document: string; variables?: GraphqlQueryVariables<T> },
  unknown,
  E,
  Partial<Pick<ClientError, 'request' | 'response'>>
> => {
  const client = 'client' in options ? options.client : new GraphQLClient(options.url, { errorPolicy: 'all' });

  const requestHeaders: RequestHeaders = options.requestHeaders ?? {};

  const toErrorResult = (clientError: ClientError) => {
    const customErrors = options.customErrors ?? ((error) => error.response.errors);
    const { request, response } = clientError;
    return { error: customErrors(clientError) as E, meta: { request, response } };
  };

  return async ({ document, variables }, { getState, endpoint, forced, type, extra }) => {
    try {
      const prepareHeaders: PrepareHeaders = options.prepareHeaders ?? ((x) => x);
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

      const {
        data,
        errors,
        extensions,
        headers: responseHeaders,
        status,
      } = await client.rawRequest(document, variables, preparedHeaders);

      // orchestrator-core reports a missing or invalid token with HTTP 200, which does not throw with errorPolicy 'all'
      if (authActive && isNotAuthenticated(errors)) {
        signOut();
      }

      // With errorPolicy 'all' a response with errors does not throw. Without any data (e.g. access denied)
      // it is an error, so queries get an error state instead of null data. It goes through customErrors as a
      // ClientError, like a non-2xx response, so callers get the same error shape regardless of the HTTP status.
      if (data == null && errors?.length) {
        return toErrorResult(
          new ClientError(
            { data, errors, extensions, headers: responseHeaders, status, body: '' },
            { query: document, variables },
          ),
        );
      }

      return {
        data,
        meta: { errors },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        if (authActive && isNotAuthenticated(error.response.errors)) {
          signOut();
        }

        return toErrorResult(error);
      }
      throw error;
    }
  };
};
