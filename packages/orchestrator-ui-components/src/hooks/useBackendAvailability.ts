import { GraphQLError } from 'graphql';

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import {
    useCheckAgentAvailabilityQuery,
    useCheckSearchAvailabilityQuery,
} from '@/rtk/endpoints/availability';

export interface BackendFeatureStatus {
    isAvailable: boolean;
    isLoading: boolean;
}

type RTKQueryError = FetchBaseQueryError | SerializedError | GraphQLError[];

const isNotFoundError = (error: RTKQueryError | undefined): boolean => {
    if (error && 'status' in error) {
        return error.status === 404;
    }
    return false;
};

export const useSearchAvailability = (): BackendFeatureStatus => {
    const { isLoading, error } = useCheckSearchAvailabilityQuery();

    if (isLoading) {
        return {
            isAvailable: false,
            isLoading: true,
        };
    }

    if (error) {
        const isNotFound = isNotFoundError(error);
        return {
            isAvailable: !isNotFound,
            isLoading: false,
        };
    }

    return {
        isAvailable: true,
        isLoading: false,
    };
};

export const useAgentAvailability = (): BackendFeatureStatus => {
    const { isLoading: agentLoading, error: agentError } =
        useCheckAgentAvailabilityQuery();

    const { isLoading: searchLoading, error: searchError } =
        useCheckSearchAvailabilityQuery();

    if (agentLoading || searchLoading) {
        return {
            isAvailable: false,
            isLoading: true,
        };
    }

    const agentNotFound = agentError ? isNotFoundError(agentError) : false;
    const searchNotFound = searchError ? isNotFoundError(searchError) : false;

    const isAvailable = !agentNotFound && !searchNotFound;

    return {
        isAvailable,
        isLoading: false,
    };
};
