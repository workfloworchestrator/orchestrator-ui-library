import { GraphQLError } from 'graphql';

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useCheckSearchAvailabilityQuery } from '@/rtk/endpoints/availability';

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
