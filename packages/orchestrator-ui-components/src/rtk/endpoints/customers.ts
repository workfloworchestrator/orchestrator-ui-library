import { Customer, CustomersResult } from '@/types';

import { orchestratorApi } from './../api';

const customersQuery = `query Customers {
  customers(first: 1000000, after: 0) {
      page {
          fullname
          identifier
          shortcode
      }:
  }
}`;

const customersApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getCustomers: build.query<Customer[], void>({
            query: () => ({ document: customersQuery }),
            transformResponse: (response: CustomersResult): Customer[] => {
                const customers = response?.customers?.page || [];
                return customers;
            },
        }),
    }),
});

export const { useGetCustomersQuery } = customersApi;
