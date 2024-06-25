import { getSession, signOut } from 'next-auth/react';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResponseHandler } from '@reduxjs/toolkit/src/query/fetchBaseQuery';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import type { WfoSession } from '@/hooks';
import { CacheTagType } from '@/types';

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
    MultipleChoices = 300,
}

type ExtraOptions = {
    baseQueryType?: BaseQueryTypes;
    apiName?: string;
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

const isUnauthorized = (status: HttpStatus) =>
    status === HttpStatus.Unauthorized || status === HttpStatus.Forbidden;
const isNotSuccessful = (status: HttpStatus) =>
    status < HttpStatus.Ok || status >= HttpStatus.MultipleChoices;

export const catchErrorResponse: ResponseHandler = async (
    response: Response,
) => {
    const status = response.status;

    if (isNotSuccessful(status)) {
        console.error(status, response.body);
    }
    if (isUnauthorized(status)) {
        signOut();
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
                    responseHandler: catchErrorResponse,
                });
                return fetchFn(args, api, {});
            default:
                const graphqlFn = graphqlRequestBaseQuery({
                    url: customApi ? customApi.apiBaseUrl : graphqlEndpointCore,
                    prepareHeaders,
                    customErrors: (error) => {
                        const { name, message, stack, response } = error;
                        if (response?.errors?.length && authActive) {
                            response.errors.map((error) => {
                                // TODO: https://github.com/workfloworchestrator/orchestrator-ui-library/issues/1105
                                if (
                                    error.extensions?.error_type ===
                                    'not_authorized'
                                ) {
                                    signOut();
                                }
                            });
                        }
                        return { name, message, stack };
                    },
                });
                return graphqlFn(args, api, {});
        }
    },
    endpoints: () => ({}),
    tagTypes: [
        CacheTagType.engineStatus,
        CacheTagType.processes,
        CacheTagType.processStatusCounts,
        CacheTagType.subscriptions,
    ],
});
