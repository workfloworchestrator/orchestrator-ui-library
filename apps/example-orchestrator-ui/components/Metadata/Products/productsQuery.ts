import { gql } from 'graphql-request';
import { SortDirection } from '@orchestrator-ui/orchestrator-ui-components';
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
export const DEFAULT_SORT_ORDER: SortDirection = SortDirection.Desc;

export const GET_PRODUCTS_GRAPHQL_QUERY: string = gql`
    query MetadataProducts($first: Int!, $after: Int!) {
        products(first: $first, after: $after) {
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
