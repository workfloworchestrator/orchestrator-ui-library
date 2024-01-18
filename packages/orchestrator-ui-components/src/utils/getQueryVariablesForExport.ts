import { MAXIMUM_ITEMS_FOR_BULK_FETCHING } from '@/configuration/constants';
import type { GraphqlQueryVariables } from '@/types';

export const getQueryVariablesForExport = <T extends object>(
    queryVariables: GraphqlQueryVariables<T>,
) => ({
    ...queryVariables,
    first: MAXIMUM_ITEMS_FOR_BULK_FETCHING,
    after: 0,
});
