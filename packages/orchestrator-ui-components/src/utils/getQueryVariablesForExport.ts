import type { GraphqlQueryVariables } from '@/types';

export const getQueryVariablesForExport = <T extends object>(
    queryVariables: GraphqlQueryVariables<T>,
) => ({
    ...queryVariables,
    first: 1000,
    after: 0,
});
