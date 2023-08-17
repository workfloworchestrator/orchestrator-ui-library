import {
    GraphQLSort,
    SortOrder,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    GraphqlSort,
    SortOrder as SortOrderGraphql,
} from '../__generated__/graphql';

// Todo, mapper might not be needed anymore
export const mapSortOrderToGraphQlSortOrder = (
    value: SortOrder,
): SortOrderGraphql =>
    value === SortOrder.ASC ? SortOrderGraphql.Asc : SortOrderGraphql.Desc;

// Todo, mapper might not be needed
export const mapToGraphQlSortBy = <Type>(
    sortBy: GraphQLSort<Type> | undefined,
): GraphqlSort | undefined => {
    if (!sortBy?.order || !sortBy?.field) {
        return undefined;
    }

    const { field, order } = sortBy;
    return {
        field: field.toString(),
        order: mapSortOrderToGraphQlSortOrder(order),
    };
};
