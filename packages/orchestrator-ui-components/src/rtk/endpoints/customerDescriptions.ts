import { CUSTOMER_DESCRIPTION_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { CustomerDescriptions } from '@/types';

const customerDescriptionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        setCustomerDescription: build.mutation<
            null,
            Pick<
                CustomerDescriptions,
                'description' | 'customerId' | 'subscriptionId'
            >
        >({
            query: (customerDescription) => ({
                url: `${CUSTOMER_DESCRIPTION_ENDPOINT}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    customer_id: customerDescription.customerId,
                    subscription_id: customerDescription.subscriptionId,
                    description: customerDescription.description,
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        updateCustomerDescription: build.mutation<null, CustomerDescriptions>({
            query: (customerDescription) => ({
                url: `${CUSTOMER_DESCRIPTION_ENDPOINT}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    id: customerDescription.id,
                    customer_id: customerDescription.customerId,
                    subscription_id: customerDescription.subscriptionId,
                    description: customerDescription.description,
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
    }),
});

export const {
    useSetCustomerDescriptionMutation,
    useUpdateCustomerDescriptionMutation,
} = customerDescriptionsApi;
