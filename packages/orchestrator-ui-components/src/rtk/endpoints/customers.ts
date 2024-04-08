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

const customerQuery = `query Customer(
        $customerId: String!
        $first: Int!
    ) {
        customers(
            first: $first
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
        getCustomer: build.query<Customer[], { customerIds: string[] }>({
            query: ({ customerIds }) => ({
                document: customerQuery,
                variables: {
                    customerId: customerIds.join('|'),
                    first: customerIds.length,
                },
            }),
            transformResponse: (response: CustomersResult): Customer[] =>
                response?.customers?.page || [],
        }),
    }),
});

export const { useGetCustomersQuery, useGetCustomerQuery } = customersApi;
