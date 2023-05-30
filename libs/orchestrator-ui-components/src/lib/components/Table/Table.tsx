import { EuiBasicTable, EuiBasicTableColumn, Pagination } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { TableHeaderCell } from './TableHeaderCell';
import React from 'react';
import { DataSorting } from './columns';

// Todo need to Pick a few props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
export type TableColumns<T> = {
    [Property in keyof T]: EuiBasicTableColumn<T> & {
        field: Property;
        name: string;
    };
};

export type TableColumnsWithExtraNonDataFields<T> = TableColumns<T> & {
    [key: string]: EuiBasicTableColumn<T> & {
        field: string;
        name?: string;
    };
};

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
        tableCaption="Demo of EuiBasicTable"
        items={data}
        rowHeader="firstName"
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
    return Object.keys(columns)
        .filter((colKey) => !hiddenColumns?.includes(colKey as keyof T))
        .map((colKey): EuiBasicTableColumn<T> => {
            const { name } = columns[colKey as keyof T];

            const sortDirection =
                dataSorting?.columnId === colKey
                    ? dataSorting.sortDirection
                    : undefined;

            return {
                ...columns[colKey as keyof T],
                field: colKey,
                name: name && (
                    <TableHeaderCell
                        sortDirection={sortDirection}
                        onClick={() => onDataSort?.(colKey as keyof T)}
                    >
                        {name}
                    </TableHeaderCell>
                ),
                truncateText: true,
            };
        });
}
