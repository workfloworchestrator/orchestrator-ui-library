import { useContext } from 'react';
import { useQuery } from 'react-query';

import { OrchestratorConfigContext } from '@/contexts';
import { GraphqlFilter, ProcessDetailResultRaw } from '@/types';

import { useQueryWithFetch } from './useQueryWithFetch';
import { useSessionWithToken } from './useSessionWithToken';

export type CacheNames = { [key: string]: string };

export const useRawProcessDetails = (processId: string) => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/processes/${processId}`;
    return useQueryWithFetch<ProcessDetailResultRaw, Record<string, never>>(
        url,
        {},
        `RawProcessDetails-${processId}`,
    );
};

export const useCacheNames = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/settings/cache-names`;
    return useQueryWithFetch<CacheNames, Record<string, never>>(
        url,
        {},
        'cacheNames',
    );
};

const filterDataByCriteria = <Type>(
    data: Type[],
    filterCriteria: GraphqlFilter<Type>[],
): Type[] => {
    return data.filter((item) => {
        return filterCriteria.some((filter) => {
            return item[filter.field] === filter.value;
        });
    });
};

export const useFilterQueryWithRest = <Type>(
    url: string,
    queryKey: string[],
    filters?: GraphqlFilter<Type>[],
    refetchInterval?: number,
) => {
    const { session } = useSessionWithToken();

    const fetchFromApi = async () => {
        const response = await fetch(url, {
            headers: {
                Authorization: session?.accessToken
                    ? `Bearer ${session.accessToken}`
                    : '',
            },
        });
        const data = await response.json();
        return filters ? filterDataByCriteria(data, filters) : data;
    };

    return useQuery(
        filters ? [...queryKey, { filters }] : [...queryKey],
        fetchFromApi,
        {
            refetchInterval,
        },
    );
};
