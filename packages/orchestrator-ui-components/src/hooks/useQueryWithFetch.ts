import { useQuery } from 'react-query';
import { Variables } from 'graphql-request/build/cjs/types';
import { signOut } from 'next-auth/react';
import { useSessionWithToken } from './useSessionWithToken';

export const useQueryWithFetch = <T, V extends Variables>(
    url: string,
    queryVars: V,
    queryKey: string,
) => {
    const { session } = useSessionWithToken();
    const requestHeaders = {
        authorization: session ? `Bearer ${session.accessToken}` : '',
    };

    const fetchData = async (): Promise<T> => {
        const response = await fetch(url, {
            method: 'GET',
            headers: requestHeaders,
        });

        if (response.status < 200 || response.status >= 300) {
            console.log(response.status, response.body);
            if (response.status === 401 || response.status === 403) {
                signOut();
            }
        }
        return (await response.json()) as T;
    };
    return useQuery([queryKey, ...Object.values(queryVars)], fetchData);
};
