import { METADATA_RESOURCE_TYPE_ENDPOINT } from '@/configuration/constants';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { ResourceType } from '@/types';

const resourceTypesApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        updateResourceType: build.mutation<null, ResourceType>({
            query: (resourceType) => ({
                url: `${METADATA_RESOURCE_TYPE_ENDPOINT}/${resourceType.resource_type_id}`,
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
