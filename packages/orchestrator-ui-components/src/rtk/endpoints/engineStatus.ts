import { EngineStatus } from '@/types';

import { BaseQueryTypes, orchestratorApi } from './../api';

const engineStatusApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getEngineStatus: build.query<EngineStatus | string, void>({
            query: () => '/settings/status',
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
            transformResponse(data: { global_status: string }) {
                if (data?.global_status === 'RUNNING') {
                    return EngineStatus.RUNNING;
                }
                return data?.global_status || 'UNKNOWN';
            },
        }),
    }),
});

export const { useGetEngineStatusQuery } = engineStatusApi;
