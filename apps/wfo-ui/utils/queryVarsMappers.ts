import {
    GraphQLSort,
    SortOrder,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    GraphqlSort,
    SortOrder as SortOrderGraphql,
} from '../__generated__/graphql';

export const mapSortOrderToGraphQlSortOrder = (
    value: SortOrder,
): SortOrderGraphql =>
    value === SortOrder.ASC ? SortOrderGraphql.Asc : SortOrderGraphql.Desc;

export const mapToGraphQlSortBy = <Type>(
<<<<<<< HEAD
    sortBy: GraphQLSort<Type>,
): GraphqlSort => {
=======
    sortBy: GraphQLSort<Type> | undefined,
): GraphqlSort | undefined => {
    if (!sortBy?.order || !sortBy?.field) {
        return undefined;
    }

>>>>>>> b27b072 (86-md-productblock: Fixes for metadata product page to make it work with the other type setup)
    const { field, order } = sortBy;
    return {
        field: field.toString(),
        order: mapSortOrderToGraphQlSortOrder(order),
    };
};
