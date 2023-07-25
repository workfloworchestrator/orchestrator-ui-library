import { useQuery } from 'react-query';
import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { ItemsList } from '../types';

async function getFavouriteSubscriptions(apiUrl: string) {
    const response = await fetch(apiUrl + '/subscriptions/?range=10%2C15');
    return await response.json();
}
async function getProcessesNeedingAttention(apiUrl: string) {
    const response = await fetch(apiUrl + '/processes/?range=100%2C105');
    return await response.json();
}
async function getRecentProcesses(apiUrl: string) {
    const response = await fetch(apiUrl + '/processes/?range=106%2C111');
    return await response.json();
}

export type CacheNames = { [key: string]: string };

async function getCacheNames(apiUrl: string) {
    const response = await fetch(apiUrl + '/settings/cache-names');
    return (await response.json()) as CacheNames;
}

export const useFavouriteSubscriptions = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const { data, isLoading } = useQuery(['favouriteSubscriptions'], () =>
        getFavouriteSubscriptions(orchestratorApiBaseUrl),
    );
    const initialData: ItemsList = {
        buttonName: 'Show all favourites',
        items: [],
        title: 'Favourite Subscriptions',
        type: 'subscription',
    };

    return isLoading
        ? initialData
        : {
              ...initialData,
              items: data,
          };
};

export const useProcessesAttention = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const { data, isLoading } = useQuery(['processesAttention'], () =>
        getProcessesNeedingAttention(orchestratorApiBaseUrl),
    );
    const initialData: ItemsList = {
        type: 'process',
        title: 'Processes that need attention',
        items: [],
        buttonName: 'Show all active processes',
    };

    return isLoading
        ? initialData
        : {
              ...initialData,
              items: data,
          };
};

export const useRecentProcesses = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const { data, isLoading } = useQuery(['recentProcesses'], () =>
        getRecentProcesses(orchestratorApiBaseUrl),
    );
    const initialData: ItemsList = {
        type: 'process',
        title: 'Recently completed processes',
        items: [],
        buttonName: 'Show all completed processes',
    };

    return isLoading
        ? initialData
        : {
              ...initialData,
              items: data,
          };
};
export const useCacheNames = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    return useQuery(['cacheNames'], () =>
        getCacheNames(orchestratorApiBaseUrl),
    );
};
