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
    sortBy: GraphQLSort<Type> | undefined,
): GraphqlSort | null => {
    if (!sortBy?.order || !sortBy?.field) {
        return null;
    }

    const { field, order } = sortBy;
    return {
        field: field.toString(),
        order: mapSortOrderToGraphQlSortOrder(order),
    };
};
