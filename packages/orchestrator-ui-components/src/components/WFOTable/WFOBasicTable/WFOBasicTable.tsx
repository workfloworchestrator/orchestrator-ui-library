import React from 'react';
import { EuiBasicTable, EuiBasicTableColumn, Pagination } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { WFOTableHeaderCell } from '../WFOTableHeaderCell';

import type {
    WFODataSorting,
    TableColumnKeys,
    WFOTableColumns,
    WFOTableColumnsWithControlColumns,
} from '../utils/columns';

export type WFOBasicTableProps<T> = {
    data: T[];
    columns: WFOTableColumnsWithControlColumns<T> | WFOTableColumns<T>;
    hiddenColumns?: TableColumnKeys<T>;
    dataSorting?: WFODataSorting<T>;
    pagination: Pagination;
    isLoading?: boolean;
    onCriteriaChange: (criteria: Criteria<T>) => void;
    onDataSort?: (columnId: keyof T) => void;
};

export const WFOBasicTable = <T,>({
    data,
    columns,
    hiddenColumns,
    dataSorting,
    pagination,
    isLoading,
    onCriteriaChange,
    onDataSort,
}: WFOBasicTableProps<T>) => (
    <EuiBasicTable
        items={data}
        columns={mapWFOTableColumnsToEuiColumns(
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

function mapWFOTableColumnsToEuiColumns<T>(
    tableColumns: WFOTableColumns<T>,
    hiddenColumns?: TableColumnKeys<T>,
    dataSorting?: WFODataSorting<T>,
    onDataSort?: (columnId: keyof T) => void,
): EuiBasicTableColumn<T>[] {
    function isVisibleColumn(columnKey: string) {
        return !hiddenColumns?.includes(columnKey as keyof T);
    }

    function mapColumnKeyToEuiColumn(colKey: string): EuiBasicTableColumn<T> {
        const typedColumnKey = colKey as keyof T;
        const column: WFOTableColumns<T>[keyof T] =
            tableColumns[typedColumnKey];
        const { name, render, width, description } = column;

        const sortDirection =
            dataSorting?.field === colKey ? dataSorting.sortOrder : undefined;

        const handleClick = () => onDataSort?.(typedColumnKey);

        return {
            render,
            width,
            description,
            field: typedColumnKey,
            name: name && (
                <WFOTableHeaderCell
                    sortDirection={sortDirection}
                    onClick={handleClick}
                >
                    {name}
                </WFOTableHeaderCell>
            ),
            truncateText: true,
            textOnly: true,
        };
    }

    return Object.keys(tableColumns)
        .filter(isVisibleColumn)
        .map(mapColumnKeyToEuiColumn);
}
