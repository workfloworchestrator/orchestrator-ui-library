import { RESOURCE_TYPE_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { ResourceTypes } from '@/types';

const resourceTypesApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        updateResourceType: build.mutation<null, ResourceTypes>({
            query: (resourceType) => ({
                url: `${RESOURCE_TYPE_ENDPOINT}/${resourceType.resource_type_id}`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    description: resourceType.description,
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
    }),
});

export const { useUpdateResourceTypeMutation } = resourceTypesApi;
