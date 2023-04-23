import { useQuery } from 'react-query';
import { useContext, useState } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { ItemsList } from '../types';

async function getFavouriteSubscriptions(apiUrl: string) {
    console.log('api url', apiUrl);
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

export const useFavouriteSubscriptions = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const [data, setData] = useState<ItemsList>({
        buttonName: '',
        items: [],
        title: '',
        type: '',
    });

    useQuery(
        ['favouriteSubscriptions'],
        () => getFavouriteSubscriptions(orchestratorApiBaseUrl),
        {
            onSuccess: (data) => {
                setData({
                    type: 'subscription',
                    title: 'Favourite Subscriptions',
                    items: data,
                    buttonName: 'Show all favourites',
                });
            },
        },
    );

    return data;
};

export const useProcessesAttention = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const [data, setData] = useState<ItemsList>({
        buttonName: '',
        items: [],
        title: '',
        type: '',
    });

    useQuery(
        ['processesAttention'],
        () => getProcessesNeedingAttention(orchestratorApiBaseUrl),
        {
            onSuccess: (data) => {
                setData({
                    type: 'process',
                    title: 'Processes that need attention',
                    items: data,
                    buttonName: 'Show all active processes',
                });
            },
        },
    );

    return data;
};

export const useRecentProcesses = () => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const [data, setData] = useState<ItemsList>({
        buttonName: '',
        items: [],
        title: '',
        type: '',
    });

    useQuery(
        ['recentProcesses'],
        () => getRecentProcesses(orchestratorApiBaseUrl),
        {
            onSuccess: (data) => {
                setData({
                    type: 'process',
                    title: 'Recently completed processes',
                    items: data,
                    buttonName: 'Show all completed processes',
                });
            },
        },
    );

    return data;
};
