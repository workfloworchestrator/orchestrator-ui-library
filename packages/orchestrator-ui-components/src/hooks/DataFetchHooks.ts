import { GraphqlFilter } from '@/types';

export type CacheNames = { [key: string]: string };

export const filterDataByCriteria = <Type>(
    data: Type[],
    filterCriteria: GraphqlFilter<Type>[],
): Type[] => {
    return data.filter((dataItem) => {
        return filterCriteria.some((filter) => {
            const dataValue = dataItem[filter.field] as unknown as string;
            const filterValue = filter.value;
            return dataValue === filterValue;
        });
    });
};
