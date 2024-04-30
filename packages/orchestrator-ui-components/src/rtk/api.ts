import { getSession } from 'next-auth/react';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import type { WfoSession } from '@/hooks';

import type { RootState } from './store';

export enum BaseQueryTypes {
    fetch = 'fetch',
    graphql = 'graphql',
    custom = 'custom',
}

export enum CacheTags {
    engineStatus = 'engineStatus',
    processList = 'processList',
    processListSummary = 'processListSummary',
    subscription = 'subscription',
    subscriptionList = 'subscriptionList',
    backendTranslations = 'backendTranslations',
}

export enum HttpStatus {
    FormNotComplete = 510,
    BadGateway = 502,
    BadRequest = 400,
    ServiceUnavailable = 503,
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

export const orchestratorApi = createApi({
    reducerPath: 'orchestratorApi',
    baseQuery: (args, api, extraOptions: ExtraOptions) => {
        const { baseQueryType, apiName } = extraOptions || {};

        const state = api.getState() as RootState;
        const { orchestratorApiBaseUrl, graphqlEndpointCore } =
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
                });
                return fetchFn(args, api, {});
            default:
                const graphqlFn = graphqlRequestBaseQuery({
                    url: customApi ? customApi.apiBaseUrl : graphqlEndpointCore,
                    prepareHeaders,
                });
                return graphqlFn(args, api, {});
        }
    },
    endpoints: () => ({}),
    tagTypes: [
        CacheTags.engineStatus,
        CacheTags.processList,
        CacheTags.processListSummary,
        CacheTags.subscriptionList,
        CacheTags.subscription,
        CacheTags.backendTranslations,
    ],
});
