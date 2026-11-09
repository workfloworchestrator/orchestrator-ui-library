import { GraphqlFilter } from '@/types';

export const filterDataByCriteria = <Type>(data: Type[], filterCriteria: GraphqlFilter<Type>[]): Type[] => {
  return data.filter((dataItem) => {
    return filterCriteria.some((filter) => {
      const dataValue = dataItem[filter.field] as unknown as string;
      const filterValue = filter.value;
      return dataValue === filterValue;
    });
  });
};
