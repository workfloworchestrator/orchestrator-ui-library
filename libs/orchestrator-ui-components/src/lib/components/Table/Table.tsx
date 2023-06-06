import { EuiBasicTable, EuiBasicTableColumn, Pagination } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { TableHeaderCell } from './TableHeaderCell';
import React from 'react';
import {
    DataSorting,
    TableColumns,
    TableColumnsWithExtraNonDataFields,
} from './columns';

export type TableProps<T> = {
    data: T[];
    columns: TableColumnsWithExtraNonDataFields<T>;
    hiddenColumns?: Array<keyof T>;
    dataSorting?: DataSorting<T>;
    pagination: Pagination;
    isLoading?: boolean;
    onCriteriaChange: (criteria: Criteria<T>) => void;
    onDataSort?: (columnId: keyof T) => void;
};

export const Table = <T,>({
    data,
    columns,
    hiddenColumns,
    dataSorting,
    pagination,
    isLoading,
    onCriteriaChange,
    onDataSort,
}: TableProps<T>) => (
    <EuiBasicTable
        items={data}
        columns={mapTableColumnsToEuiColumns(
            columns,
            hiddenColumns,
            dataSorting,
            onDataSort,
        )}
        pagination={pagination}
        onChange={onCriteriaChange}
        loading={isLoading}
    />
);

function mapTableColumnsToEuiColumns<T>(
    columns: TableColumns<T>,
    hiddenColumns?: Array<keyof T>,
    dataSorting?: DataSorting<T>,
    onDataSort?: (columnId: keyof T) => void,
): EuiBasicTableColumn<T>[] {
    function isVisibleColumn(columnKey: string) {
        return !hiddenColumns?.includes(columnKey as keyof T);
    }

    function mapToEuiColumn(colKey: string): EuiBasicTableColumn<T> {
        const typedColumnKey = colKey as keyof T;
        const column = columns[typedColumnKey];
        const { name } = column;

        const sortDirection =
            dataSorting?.columnId === colKey
                ? dataSorting.sortDirection
                : undefined;

        const handleClick = () => onDataSort?.(typedColumnKey);

        return {
            ...column,
            field: typedColumnKey,
            name: name && (
                <TableHeaderCell
                    sortDirection={sortDirection}
                    onClick={handleClick}
                >
                    {name}
                </TableHeaderCell>
            ),
            truncateText: true,
        };
    }

    return Object.keys(columns).filter(isVisibleColumn).map(mapToEuiColumn);
}
