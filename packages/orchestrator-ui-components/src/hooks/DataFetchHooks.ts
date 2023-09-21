import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { GraphqlFilter, ItemsList, ProcessFromRestApi } from '../types';
import { useQueryWithFetch } from './useQueryWithFetch';
import { useQuery } from 'react-query';

export type CacheNames = { [key: string]: string };

export const useFavouriteSubscriptions = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/subscriptions/?range=10%2C15`;
    const initialData: ItemsList = {
        buttonName: 'Show all favourites',
        items: [],
        title: 'Favourite Subscriptions',
        type: 'subscription',
    };

    const { data, isLoading } = useQueryWithFetch<
        ProcessFromRestApi[],
        Record<string, never>
    >(url, {}, 'favouriteSubscriptions');
    return isLoading ? initialData : { ...initialData, items: data || [] };
};

export const useProcessesAttention = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/processes/?range=100%2C105`;
    const initialData: ItemsList = {
        type: 'process',
        title: 'Processes that need attention',
        items: [],
        buttonName: 'Show all active processes',
    };

    const { data, isLoading } = useQueryWithFetch<
        ProcessFromRestApi[],
        Record<string, never>
    >(url, {}, 'processesAttention');
    return isLoading ? initialData : { ...initialData, items: data || [] };
};

export const useRecentProcesses = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/processes/?range=106%2C111`;
    const initialData: ItemsList = {
        type: 'process',
        title: 'Recently completed processes',
        items: [],
        buttonName: 'Show all completed processes',
    };

    const { data, isLoading } = useQueryWithFetch<
        ProcessFromRestApi[],
        Record<string, never>
    >(url, {}, 'recentProcesses');
    return isLoading ? initialData : { ...initialData, items: data || [] };
};

export const useCacheNames = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const url = `${orchestratorApiBaseUrl}/settings/cache-names`;
    return useQueryWithFetch<CacheNames, Record<string, never>>(
        url,
        {},
        'recentProcesses',
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
    endpoint: string,
    queryKey: string,
    filters?: GraphqlFilter<Type>[],
    refetchInterval?: number,
) => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);

    const fetchFromApi = async () => {
        const response = await fetch(orchestratorApiBaseUrl + endpoint);
        const data = (await response.json()) as Type[];
        return filters ? filterDataByCriteria(data, filters) : data;
    };

    return useQuery<Type[]>(
        filters ? [queryKey, { filters }] : [queryKey],
        fetchFromApi,
        {
            refetchInterval,
        },
    );
};
