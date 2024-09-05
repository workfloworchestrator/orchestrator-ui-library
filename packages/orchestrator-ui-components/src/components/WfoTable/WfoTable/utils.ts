import { TableColumnKeys } from '@/components';
import { toObjectWithSortedKeys } from '@/utils';

import {
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
