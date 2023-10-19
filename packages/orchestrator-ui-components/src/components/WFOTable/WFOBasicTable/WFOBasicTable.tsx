import React, { ReactNode } from 'react';
import { EuiBasicTable, EuiBasicTableColumn, Pagination } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { WFOTableHeaderCell } from './WFOTableHeaderCell';

import type {
    WFODataSorting,
    TableColumnKeys,
    WFODataSearch,
} from '../utils/columns';
import {
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
    onUpdateDataSorting?: (updatedDataSorting: WFODataSorting<T>) => void;
    onDataSearch?: (updatedDataSearch: WFODataSearch<T>) => void;
};

export const WFOBasicTable = <T,>({
    data,
    columns,
    hiddenColumns,
    dataSorting,
    pagination,
    isLoading,
    onCriteriaChange,
    onUpdateDataSorting,
    onDataSearch,
}: WFOBasicTableProps<T>) => {
    const { theme } = useOrchestratorTheme();
    const { basicTableStyle } = getStyles(theme);

    return (
        <EuiBasicTable
            css={basicTableStyle}
            items={data}
            columns={mapWFOTableColumnsToEuiColumns(
                columns,
                hiddenColumns,
                dataSorting,
                onUpdateDataSorting,
                onDataSearch,
            )}
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
    onDataSort?: (updatedDataSorting: WFODataSorting<T>) => void,
    onDataSearch?: (updatedDataSearch: WFODataSearch<T>) => void,
): EuiBasicTableColumn<T>[] {
    function isVisibleColumn(columnKey: string) {
        return !hiddenColumns?.includes(columnKey as keyof T);
    }

    function mapColumnKeyToEuiColumn(colKey: string): EuiBasicTableColumn<T> {
        const typedColumnKey = colKey as keyof T;
        const column: WFOBasicTableColumns<T>[keyof T] =
            tableColumns[typedColumnKey];
        const { name, render, width, description, sortable } = column;

        const sortOrder =
            dataSorting?.field === colKey ? dataSorting.sortOrder : undefined;

        // Not spreading the column object here as it might contain additional props.
        // EUI does not handle extra props well.
        return {
            render,
            width,
            description,
            field: typedColumnKey,
            name: name && (
                <WFOTableHeaderCell
                    fieldName={typedColumnKey.toString()}
                    sortOrder={sortOrder}
                    isSortable={sortable}
                    onSetSortOrder={(sortOrder) =>
                        onDataSort?.({ field: typedColumnKey, sortOrder })
                    }
                    onSearch={(searchText) =>
                        onDataSearch?.({ field: typedColumnKey, searchText })
                    }
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
