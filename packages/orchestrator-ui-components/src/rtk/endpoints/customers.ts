import { Customer, CustomersResult } from '@/types';

import { orchestratorApi } from '../api';

const customersQuery = `query Customers {
    customers(first: 1000000, after: 0) {
        page {
            fullname
            customerId
            shortcode
        }
    }
}`;

// Todo: fix hardcoded "first 10"
const customerQuery = `query Customer($customerId: String!) {
    customers(
        first: 10
        filterBy: [{field: "customerId", value: $customerId}]
    ) {
        page {
            customerId
            fullname
            shortcode
      }
    }
}`;

const customersApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getCustomers: build.query<Customer[], void>({
            query: () => ({ document: customersQuery }),
            transformResponse: (response: CustomersResult): Customer[] =>
                response?.customers?.page || [],
        }),
        getCustomer: build.query<
            Customer[],
            { customerIds: string | string[] }
        >({
            query: (inputParameters) => ({
                document: customerQuery,
                variables: {
                    customerId: Array.isArray(inputParameters.customerIds)
                        ? inputParameters.customerIds.join('|')
                        : inputParameters.customerIds,
                },
            }),
            transformResponse: (response: CustomersResult): Customer[] =>
                response?.customers?.page || [],
        }),
    }),
});

export const { useGetCustomersQuery, useGetCustomerQuery } = customersApi;
