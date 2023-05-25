import { EuiBasicTable, EuiBasicTableColumn, Pagination } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { TableHeaderCell } from './TableHeaderCell';
import React from 'react';

// Todo need to Pick a few props from EuiBasicTableColumn to prevent none-functioning props (truncateText)
export type TableTableColumns<T> = {
    [Property in keyof T]: EuiBasicTableColumn<T> & {
        field: Property;
        name: string;
    };
} & {
    [key: string]: EuiBasicTableColumn<T> & {
        field: string;
        name?: string;
    };
};

export type TableTableProps<T> = {
    data: T[];
    columns: TableTableColumns<T>;
    hiddenColumns?: Array<keyof T>;
    pagination: Pagination;
    onCriteriaChange: (criteria: Criteria<T>) => void;
};

export const TableTable = <T,>({
    data,
    columns,
    hiddenColumns,
    pagination,
    onCriteriaChange,
}: TableTableProps<T>) => {
    return (
        <EuiBasicTable
            tableCaption="Demo of EuiBasicTable"
            items={data}
            rowHeader="firstName"
            columns={mapTableColumnsToEuiColumns(columns, hiddenColumns)}
            pagination={pagination}
            onChange={onCriteriaChange}
        />
    );
};

function mapTableColumnsToEuiColumns<T>(
    columns: TableTableColumns<T>,
    hiddenColumns?: Array<keyof T>,
): EuiBasicTableColumn<T>[] {
    return Object.keys(columns)
        .filter((colKey) => !hiddenColumns?.includes(colKey as keyof T))
        .map((colKey): EuiBasicTableColumn<T> => {
            const { name } = columns[colKey as keyof T];

            return {
                ...columns[colKey as keyof T],
                field: colKey,
                name: name && <TableHeaderCell>{name}</TableHeaderCell>,
                truncateText: true,
            };
        });
}
