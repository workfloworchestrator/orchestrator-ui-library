import { gql } from 'graphql-request';
import { SortOrder } from '@orchestrator-ui/orchestrator-ui-components';
import type {
    GraphQlResultPageInfo,
    Product,
} from '@orchestrator-ui/orchestrator-ui-components';

export type ProductsResult = {
    products: {
        page: Product[];
        pageInfo: GraphQlResultPageInfo;
    };
};

export const DEFAULT_SORT_FIELD: keyof Product = 'name';
export const DEFAULT_SORT_ORDER: SortOrder = SortOrder.DESC;

export const GET_PRODUCTS_GRAPHQL_QUERY: string = gql`
    query MetadataProducts(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
    ) {
        products(first: $first, after: $after, sortBy: $sortBy) {
            page {
                name
                description
                tag
                createdAt
                productType
                status
                productBlocks {
                    name
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
            }
        }
    }
`;
