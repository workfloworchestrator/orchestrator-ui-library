import { useQuery } from 'react-query';
import { Variables } from 'graphql-request/build/cjs/types';
import { useSession, signOut } from 'next-auth/react';

export const useQueryWithFetch = <T, V extends Variables>(
    url: string,
    queryVars: V,
    queryKey: string,
) => {
    const { data } = useSession();
    let requestHeaders = {};

    if (data) {
        // not sure how to type this...
        // @ts-ignore
        const { accessToken } = data;

        requestHeaders = {
            authorization: `Bearer ${accessToken}`,
        };
    }

    const fetchData = async (): Promise<T> => {
        const response = await fetch(url, {
            method: 'GET',
            headers: requestHeaders,
        });

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401 || response.status === 403) {
                signOut();
            }
        }
        return (await response.json()) as T;
    };
    return useQuery([queryKey, ...Object.values(queryVars)], fetchData);
};
