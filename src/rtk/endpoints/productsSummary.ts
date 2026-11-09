import { orchestratorApi } from '@/rtk';
import {
  BaseGraphQlResult,
  GraphqlQueryVariables,
  ProductDefinitionsResult,
  ProductsSummary,
  Subscription,
} from '@/types';

export const productsSummary = `
    query MetadataProducts(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
    ) {
        products(first: $first, after: $after, sortBy: $sortBy) {
            page {
                name
                subscriptions(filterBy: $filterBy) {
                    pageInfo {
                        totalItems
                    }
                }
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
    }
`;

export type ProductsSummaryResponse = {
  products: ProductsSummary[];
} & BaseGraphQlResult;

const productsSummaryApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductsSummary: builder.query<ProductsSummaryResponse, GraphqlQueryVariables<ProductsSummary & Subscription>>({
      query: (variables) => ({
        document: productsSummary,
        variables,
      }),
      transformResponse: (response: ProductDefinitionsResult<ProductsSummary>): ProductsSummaryResponse => {
        const products = response.products.page || [];
        const pageInfo = response.products.pageInfo || {};

        return {
          products,
          pageInfo,
        };
      },
    }),
  }),
});

export const { useGetProductsSummaryQuery } = productsSummaryApi;
