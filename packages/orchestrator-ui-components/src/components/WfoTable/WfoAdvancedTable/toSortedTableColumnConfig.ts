import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';

export const toSortedTableColumnConfig = <T extends object>(
  columnConfig: WfoAdvancedTableColumnConfig<T>,
  columnKeys: (keyof WfoAdvancedTableColumnConfig<T>)[],
): WfoAdvancedTableColumnConfig<T> =>
  columnKeys.reduce((sortedConfig, key) => {
    if (key in columnConfig) {
      sortedConfig[key] = columnConfig[key];
    }
    return sortedConfig;
  }, {} as WfoAdvancedTableColumnConfig<T>);
