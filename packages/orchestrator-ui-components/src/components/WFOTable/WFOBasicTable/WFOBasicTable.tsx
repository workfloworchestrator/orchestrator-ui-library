import React, { ReactNode } from 'react';
import {
    EuiBasicTable,
    EuiBasicTableColumn,
    EuiTableSortingType,
    Pagination,
} from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { WFOTableHeaderCell } from './WFOTableHeaderCell';

import type { WFODataSorting, TableColumnKeys } from '../utils/columns';
import {
    WFO_TABLE_COLOR_FIELD,
    WFOTableControlColumnConfig,
    WFOTableDataColumnConfig,
} from '../utils/columns';
import { useOrchestratorTheme } from '../../../hooks';
import { getStyles } from './styles';

export type WFOBasicTableColumns<T> = {
    [Property in keyof T]: WFOTableDataColumnConfig<T, Property> & {
        render?: (cellValue: T[Property], row: T) => ReactNode;
    };
};

export type WFOBasicTableColumnsWithControlColumns<T> =
    WFOBasicTableColumns<T> & WFOTableControlColumnConfig<T>;

export type WFOBasicTableProps<T> = {
    data: T[];
    columns:
        | WFOBasicTableColumnsWithControlColumns<T>
        | WFOBasicTableColumns<T>;
    hiddenColumns?: TableColumnKeys<T>;
    dataSorting?: WFODataSorting<T>;
    pagination?: Pagination;
    isLoading?: boolean;
    onCriteriaChange?: (criteria: Criteria<T>) => void;
    onDataSort?: (columnId: keyof T) => void;
    sorting?: EuiTableSortingType<T>;
    color?: boolean;
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
    sorting,
}: WFOBasicTableProps<T>) => {
    const { theme } = useOrchestratorTheme();
    const { basicTableStyle, basicTableWithColorColumn } = getStyles(theme);
    const styles = columns.hasOwnProperty(WFO_TABLE_COLOR_FIELD)
        ? basicTableWithColorColumn
        : basicTableStyle;

    return (
        <EuiBasicTable
            css={styles}
            items={data}
            columns={mapWFOTableColumnsToEuiColumns(
                columns,
                hiddenColumns,
                dataSorting,
                onDataSort,
            )}
            sorting={sorting}
            pagination={pagination}
            onChange={onCriteriaChange}
            loading={isLoading}
        />
    );
};

function mapWFOTableColumnsToEuiColumns<T>(
    tableColumns: WFOBasicTableColumns<T>,
    hiddenColumns?: TableColumnKeys<T>,
    dataSorting?: WFODataSorting<T>,
    onDataSort?: (columnId: keyof T) => void,
): EuiBasicTableColumn<T>[] {
    function isVisibleColumn(columnKey: string) {
        return !hiddenColumns?.includes(columnKey as keyof T);
    }

    function mapColumnKeyToEuiColumn(colKey: string): EuiBasicTableColumn<T> {
        const typedColumnKey = colKey as keyof T;
        const column: WFOBasicTableColumns<T>[keyof T] =
            tableColumns[typedColumnKey];
        const { name, render, width, description, sortable } = column;

        const sortDirection =
            dataSorting?.field === colKey ? dataSorting.sortOrder : undefined;

        const handleClick = () => onDataSort?.(typedColumnKey);

        // Not spreading the column object here as it might contain additional props.
        // EUI does not handle extra props well.
        return {
            render,
            width,
            description,
            field: typedColumnKey,
            name: name && (
                <WFOTableHeaderCell
                    sortDirection={sortDirection}
                    onClick={handleClick}
                    isSortable={sortable}
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
