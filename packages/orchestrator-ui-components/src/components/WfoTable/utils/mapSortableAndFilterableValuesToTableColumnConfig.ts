import { WfoTableColumns, WfoTableDataColumnConfig } from './columns';

// Todo remove before PR
export function mapSortableAndFilterableValuesToTableColumnConfig<
    T extends object,
>(
    tableColumnConfig: WfoTableColumns<T>,
    sortableFieldNames: string[] = [],
    filterableFieldNames: string[] = [],
): WfoTableColumns<T> {
    const tableConfigValues =
        Object.values<WfoTableDataColumnConfig<T, keyof T>>(tableColumnConfig);

    const updatedTableConfigEntries = tableConfigValues.map((value) => [
        value.field,
        {
            ...value,
            sortable: sortableFieldNames.includes(value.field.toString()),
            filterable: filterableFieldNames.includes(value.field.toString()),
        },
    ]);

    return Object.fromEntries(updatedTableConfigEntries);
}
