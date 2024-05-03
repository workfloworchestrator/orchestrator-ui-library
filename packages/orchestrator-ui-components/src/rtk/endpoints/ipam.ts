import { IpBlock, IpPrefix } from '@/components';
import {
    IPAM_FREE_SUBNETS_ENDPOINT,
    IPAM_IP_BLOCKS_ENDPOINT,
    IPAM_PREFIX_FILTERS_ENDPOINT,
} from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const ipamApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        prefixFilters: build.query<IpPrefix[], void>({
            query: () => ({
                url: `${IPAM_PREFIX_FILTERS_ENDPOINT}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        ipBlocks: build.query<IpBlock[], { parentPrefix: number }>({
            query: ({ parentPrefix }) => ({
                url: `${IPAM_IP_BLOCKS_ENDPOINT}/${parentPrefix}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        freeSubnets: build.query<
            string[],
            { subnet: string; netmask: number; prefixLen: number }
        >({
            query: ({ subnet, netmask, prefixLen }) => ({
                url: `${IPAM_FREE_SUBNETS_ENDPOINT}/${subnet}/${netmask}/${prefixLen}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
    }),
});

export const { usePrefixFiltersQuery, useIpBlocksQuery, useFreeSubnetsQuery } =
    ipamApi;
