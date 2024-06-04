import { getSession, signOut } from 'next-auth/react';

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
    cacheNames = 'cacheNames',
    processDetail = 'processDetail',
    processList = 'processList',
    processListSummary = 'processListSummary',
    subscription = 'subscription',
    subscriptionList = 'subscriptionList',
    backendTranslations = 'backendTranslations',
    processStatusCounts = 'processStatusCounts',
    subscriptionActions = 'subscriptionActions',
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
        CacheTags.engineStatus,
        CacheTags.cacheNames,
        CacheTags.processDetail,
        CacheTags.processList,
        CacheTags.processListSummary,
        CacheTags.subscriptionList,
        CacheTags.subscription,
        CacheTags.backendTranslations,
        CacheTags.processStatusCounts,
        CacheTags.subscriptionActions,
    ],
});
