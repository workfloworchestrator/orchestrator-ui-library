import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import {
  Customer,
  CustomerWithSubscriptionCount,
  CustomersResult,
  CustomersWithSubscriptionCountResult,
  SubscriptionStatus,
} from '@/types';

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

const customersWithSubscriptionCountQuery = `query Customers {
  customers(first: ${NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS}, after: 0) {
    page {
      customerId
      fullname
      shortcode
      subscriptions(filterBy: {field: "status", value: "${SubscriptionStatus.ACTIVE}"}) {
        pageInfo {
          totalItems
        }
      }
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
    getCustomersWithSubscriptionCount: build.query<CustomerWithSubscriptionCount[], void>({
      query: () => ({ document: customersWithSubscriptionCountQuery }),
      transformResponse: (response: CustomersWithSubscriptionCountResult): CustomerWithSubscriptionCount[] =>
        response.customers.page.filter((customer) => customer.subscriptions.pageInfo.totalItems > 0),
    }),
    getCustomers: build.query<Customer[], void>({
      query: () => ({ document: customersQuery }),
      transformResponse: (response: CustomersResult): Customer[] => response?.customers?.page || [],
    }),
    getCustomer: build.query<Customer[], { customerIds: string[] }>({
      query: ({ customerIds }) => ({
        document: customerQuery,
        variables: {
          customerId: customerIds.join('|'),
          first: customerIds.length,
        },
      }),
      transformResponse: (response: CustomersResult): Customer[] => response?.customers?.page || [],
    }),
  }),
});

export const { useGetCustomersQuery, useGetCustomerQuery, useGetCustomersWithSubscriptionCountQuery } = customersApi;
