import { ColumnType, TableColumnKeys, TableSettingsColumnConfig, WfoTableColumnConfig } from '@/components';

export const getTableSettingsColumns = <T extends object>(
  columnConfig: WfoTableColumnConfig<T>,
  hiddenColumns: TableColumnKeys<T>,
  nonEditableColumns: TableColumnKeys<T> = [],
): TableSettingsColumnConfig<T>[] =>
  Object.entries(columnConfig)
    .filter(([, columnItemConfig]) => columnItemConfig.columnType === ColumnType.DATA)
    .map(([key, { label }]): TableSettingsColumnConfig<T> => {
      const field = key as keyof T;

      return {
        field,
        name: label,
        isVisible: hiddenColumns.indexOf(field) === -1,
        isEditable: nonEditableColumns.indexOf(field) === -1,
      };
    });
