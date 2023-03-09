import React, { createContext, FC, ReactNode, useState } from 'react';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    UseQueryResult,
} from 'react-query';

type ContextType = {
    useEngineStatus: UseQueryResult;
};

export const DataContext = createContext<Partial<ContextType>>({});

export type DataProviderProps = {
    statusEndpointUrl: string; // todo should be object containing urls
    children: ReactNode;
};

// todo could be a prop while initializing the context
const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 60 * 1000,
            cacheTime: 5 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
};

const DataProviderWithoutQueryClient: FC<DataProviderProps> = ({
    children,
    statusEndpointUrl,
}) => {
    const fetchEngineStatus = async () => {
        const response = await fetch(statusEndpointUrl, {
            method: 'GET',
        });
        return await response.json();
    };
    const useEngineStatus = useQuery('engineStatus', fetchEngineStatus);

    return (
        <DataContext.Provider value={{ useEngineStatus }}>
            {children}
        </DataContext.Provider>
    );
};

export const DataProvider: FC<DataProviderProps> = (props) => {
    const [queryClient] = useState(() => new QueryClient(queryClientConfig));

    return (
        <QueryClientProvider client={queryClient}>
            <DataProviderWithoutQueryClient {...props}>
                {props.children}
            </DataProviderWithoutQueryClient>
        </QueryClientProvider>
    );
};
