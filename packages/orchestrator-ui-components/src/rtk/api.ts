import { getSession, signOut } from 'next-auth/react';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { WfoSession } from '@/hooks';
import { utils } from '@/rtk/wfoGraphqlRequestBaseQuery';
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
                const graphqlFn = utils(
                    {
                        url: customApi
                            ? customApi.apiBaseUrl
                            : graphqlEndpointCore,
                        prepareHeaders,
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
});
