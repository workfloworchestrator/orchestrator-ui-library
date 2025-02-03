import { ClientError } from 'graphql-request';
import { GraphQLErrorExtensions } from 'graphql/error/GraphQLError';
import { getSession, signOut } from 'next-auth/react';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ErrorResponse } from '@rtk-query/graphql-request-base-query/dist/GraphqlBaseQueryTypes';

import { SubscriptionListItem } from '@/components';
import type { WfoSession } from '@/hooks';
import { wfoGraphqlRequestBaseQuery } from '@/rtk/wfoGraphqlRequestBaseQuery';
import { CacheTagType, GraphqlQueryVariables } from '@/types';

import type { RootState } from './store';

export enum BaseQueryTypes {
    fetch = 'fetch',
    graphql = 'graphql',
    custom = 'custom',
}

export enum HttpStatus {
    FormNotComplete = 510,
    BadGateway = 502,
    BadRequest = 400,
    ServiceUnavailable = 503,
    Unauthorized = 401,
    Forbidden = 403,
    Ok = 200,
    NoContent = 204,
    MultipleChoices = 300,
}

export interface ApiResult<T> {
    data?: T;
    error?: ErrorResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch?: () => void;
    selectFromResult?: (result: T) => T;
    endpointName?: string;
}

interface UseQueryOptions<T, U> {
    selectFromResult?: (
        result: ApiResult<T>,
    ) => Partial<ApiResult<T>> & { selectedItem?: U };
    subscriptionId?: string;
}

interface UseQueryReturn<T, U> extends ApiResult<T> {
    selectedItem?: U;
    endpointName?: string;
}

export type UseQuery<T, U> = (
    queryVariables?: GraphqlQueryVariables<SubscriptionListItem>,
    options?: UseQueryOptions<T, U>,
) => UseQueryReturn<T, U>;

type ExtraOptions = {
    baseQueryType?: BaseQueryTypes;
    apiName?: string;
};

export type WfoGraphqlError = {
    extensions: GraphQLErrorExtensions;
    message: string;
};

export type WfoGraphqlErrorsMeta = {
    errors: WfoGraphqlError[];
};

export const prepareHeaders = async (headers: Headers) => {
    const session = (await getSession()) as WfoSession;
    if (session?.accessToken) {
        headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
    return headers;
};

export const handlePromiseErrorWithCallback = <T>(
    promise: Promise<unknown>,
    status: HttpStatus,
    callbackAction: (json: T) => void,
) => {
    return promise.catch((err) => {
        if (err.data && err.status === status) {
            callbackAction(err.data);
        } else {
            throw err;
        }
    });
};

// There are cases where a GraphQL endpoint return both data and errors
// Only throwing the error when the data is not there or invalid
export const handleGraphqlMetaErrors = (
    meta: WfoGraphqlErrorsMeta,
    responseHasInvalidData?: boolean,
) => {
    if (responseHasInvalidData && meta.errors && meta.errors.length > 0) {
        throw meta.errors[0];
    }
};

const isUnauthorized = (status: HttpStatus) =>
    status === HttpStatus.Unauthorized || status === HttpStatus.Forbidden;
const isNotSuccessful = (status: HttpStatus) =>
    status < HttpStatus.Ok || status >= HttpStatus.MultipleChoices;

export const catchErrorResponse = async (
    response: Response,
    authActive: boolean,
) => {
    const status = response.status;

    if (isNotSuccessful(status)) {
        console.error(status, response.body);
    }
    if (isUnauthorized(status) && authActive) {
        signOut();
    } else if (status === HttpStatus.NoContent) {
        return {};
    } else {
        return response.json();
    }
};

export const orchestratorApi = createApi({
    reducerPath: 'orchestratorApi',
    baseQuery: (args, api, extraOptions: ExtraOptions) => {
        const { baseQueryType, apiName } = extraOptions || {};

        const state = api.getState() as RootState;
        const { orchestratorApiBaseUrl, graphqlEndpointCore, authActive } =
            state.orchestratorConfig;

        const customApi = state.customApis?.find(
            (query) => query.apiName === apiName,
        );

        switch (baseQueryType) {
            case BaseQueryTypes.fetch:
                const fetchFn = fetchBaseQuery({
                    baseUrl: customApi
                        ? customApi.apiBaseUrl
                        : orchestratorApiBaseUrl,
                    prepareHeaders,
                    responseHandler: (response) =>
                        catchErrorResponse(response, authActive),
                });
                return fetchFn(args, api, {});
            default:
                const graphqlFn = wfoGraphqlRequestBaseQuery(
                    {
                        url: customApi
                            ? customApi.apiBaseUrl
                            : graphqlEndpointCore,
                        prepareHeaders,
                        customErrors: (args: ClientError) => {
                            return args.response?.errors;
                        },
                    },
                    authActive,
                );
                return graphqlFn(args, api, {});
        }
    },
    endpoints: () => ({}),
    tagTypes: [
        CacheTagType.engineStatus,
        CacheTagType.workerStatus,
        CacheTagType.processes,
        CacheTagType.processStatusCounts,
        CacheTagType.subscriptions,
    ],
    keepUnusedDataFor:
        process.env.NEXT_PUBLIC_DISABLE_CACHE === 'true' ? 0 : 60 * 60 * 1000,
});
