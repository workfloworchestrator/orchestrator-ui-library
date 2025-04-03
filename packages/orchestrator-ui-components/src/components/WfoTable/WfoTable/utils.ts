import { LocalColumnWidths, TableColumnKeys } from '@/components';
import { SortOrder } from '@/types';
import { toObjectWithSortedKeys } from '@/utils';

import {
    ColumnType,
    WfoTableColumnConfig,
    WfoTableControlColumnConfigItem,
    WfoTableDataColumnConfigItem,
} from './WfoTable';

export const getSortedVisibleColumns = <T extends object>(
    columnConfig: WfoTableColumnConfig<T>,
    columnOrder: TableColumnKeys<T>,
    hiddenColumns: TableColumnKeys<T>,
) => {
    const tableHeadersEntries: Array<
        [
            string,
            (
                | WfoTableControlColumnConfigItem<T>
                | WfoTableDataColumnConfigItem<T, keyof T>
            ),
        ]
    > = Object.entries(
        toObjectWithSortedKeys(
            columnConfig,
            columnOrder.map((value) => value.toString()),
        ),
    );

    return tableHeadersEntries.filter(
        ([columnId]) => !hiddenColumns.includes(columnId as keyof T),
    );
};

export const getUpdatedSortOrder = (currentSortOrder?: SortOrder) =>
    currentSortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;

/**
 * Maps from WfoTableColumnConfig to WfoTableColumnConfig.
 * A generic type must be provided to prevent type errors
 * @param tableColumnConfig
 * @param sortableFieldNames
 * @param filterableFieldNames
 *
 * @returns updated WfoTableColumnConfig with isSortable and isFilterable set
 */
export function mapSortableAndFilterableValuesToTableColumnConfig<
    T extends object,
>(
    tableColumnConfig: WfoTableColumnConfig<T>,
    sortableFieldNames: string[] = [],
    filterableFieldNames: string[] = [],
): WfoTableColumnConfig<T> {
    const tableColumnConfigEntries: [
        string,
        (
            | WfoTableControlColumnConfigItem<T>
            | WfoTableDataColumnConfigItem<T, keyof T>
        ),
    ][] = Object.entries(tableColumnConfig);

    const tableColumnConfigUpdatedEntries = tableColumnConfigEntries.map(
        ([key, value]) => {
            if (value.columnType === ColumnType.DATA) {
                return [
                    key,
                    {
                        ...value,
                        isSortable: sortableFieldNames.includes(key),
                        isFilterable: filterableFieldNames.includes(key),
                    },
                ];
            }

            return [key, value];
        },
    );

    return Object.fromEntries(tableColumnConfigUpdatedEntries);
}

export const getColumnWidthsFromConfig = <T extends object>(
    columnConfig: WfoTableColumnConfig<T>,
): LocalColumnWidths => {
    const columnEntries = Object.entries(columnConfig);

    return columnEntries.reduce((columnWidths, [key, config]) => {
        if (config.columnType === ColumnType.DATA) {
            columnWidths[key] = config.width ?? 'auto';
        }
        return columnWidths;
    }, {} as LocalColumnWidths);
};
