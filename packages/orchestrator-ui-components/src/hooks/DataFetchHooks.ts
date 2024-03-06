import { useContext } from 'react';
import { useQuery } from 'react-query';

import { OrchestratorConfigContext } from '@/contexts';
import { GraphqlFilter, ProcessDetailResultRaw } from '@/types';

import { useQueryWithFetch } from './useQueryWithFetch';
import { useWfoSession } from './useWfoSession';

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

export const filterDataByCriteria = <Type>(
    data: Type[],
    filterCriteria: GraphqlFilter<Type>[],
): Type[] => {
    return data.filter((dataItem) => {
        return filterCriteria.some((filter) => {
            const dataValue = dataItem[filter.field] as unknown as string;
            const filterValue = filter.value;
            return dataValue === filterValue;
        });
    });
};

export const useFilterQueryWithRest = <Type>(
    url: string,
    queryKey: string[],
    filters?: GraphqlFilter<Type>[],
    refetchInterval?: number,
) => {
    const { session } = useWfoSession();

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
