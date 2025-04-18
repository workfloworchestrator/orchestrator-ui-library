import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import { orchestratorApi } from '@/rtk';
import {
    GraphqlQueryVariables,
    SubscriptionDropdownOption,
    SubscriptionDropdownOptionsResult,
} from '@/types';

export const subscriptionsDropdownOptionsQuery = `
    query SubscriptionDropdownOptions(
        $filterBy: [GraphqlFilter!]
        $first: Int!
    ) {
        subscriptions(filterBy: $filterBy, first: $first, after: 0) {
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
                variables: {
                    ...variables,
                    first: NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS,
                },
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
