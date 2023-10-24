import { WfoTableColumns, WfoTableDataColumnConfig } from './columns';

export function mapSortableAndFilterableValuesToTableColumnConfig<T>(
    tableColumnConfig: WfoTableColumns<T>,
    sortableFieldNames: string[],
    filterableFieldNames: string[],
): WfoTableColumns<T> {
    const tableConfigValues =
        Object.values<WfoTableDataColumnConfig<T, keyof T>>(tableColumnConfig);

    const updatedTableConfigValues = tableConfigValues.map((value) => ({
        ...value,
        sortable: sortableFieldNames.includes(value.field.toString()),
        filterable: filterableFieldNames.includes(value.field.toString()),
    }));

    const updatedTableConfigEntries = updatedTableConfigValues.map((value) => [
        value.field,
        value,
    ]);

    return Object.fromEntries(updatedTableConfigEntries);
}
