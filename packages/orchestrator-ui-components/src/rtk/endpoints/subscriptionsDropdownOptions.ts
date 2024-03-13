import { orchestratorApi } from '@/rtk';
import {
    GraphqlQueryVariables,
    SubscriptionDropdownOption,
    SubscriptionDropdownOptionsResult,
} from '@/types';

export const subscriptionsDropdownOptionsQuery = `
    query SubscriptionDropdownOptions($filterBy: [GraphqlFilter!]) {
        subscriptions(filterBy: $filterBy, first: 1000000, after: 0) {
            page {
                description
                subscriptionId
                product {
                    tag
                    productId
                }
                customer {
                    fullname
                    customerId
                }
                productBlockInstances {
                    id
                    ownerSubscriptionId
                    parent
                    productBlockInstanceValues
                    subscriptionInstanceId
                    inUseByRelations
                }
                fixedInputs
            }
        }
    }
`;

export type SubscriptionDropdownOptionsResponse = {
    subscriptionDropdownOptions: SubscriptionDropdownOption[];
};

const subscriptionsDropdownOptionsApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionsDropdownOptions: builder.query<
            SubscriptionDropdownOptionsResponse,
            GraphqlQueryVariables<SubscriptionDropdownOption>
        >({
            query: (variables) => ({
                document: subscriptionsDropdownOptionsQuery,
                variables,
            }),
            transformResponse: (
                response: SubscriptionDropdownOptionsResult,
            ): SubscriptionDropdownOptionsResponse => {
                const subscriptionDropdownOptions =
                    response.subscriptions.page || [];

                return {
                    subscriptionDropdownOptions,
                };
            },
        }),
    }),
});

export const { useGetSubscriptionsDropdownOptionsQuery } =
    subscriptionsDropdownOptionsApi;
