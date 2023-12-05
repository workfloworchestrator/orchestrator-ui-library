import React from 'react';

import { EuiBasicTable, EuiBasicTableColumn, tint } from '@elastic/eui';
import { css } from '@emotion/react';

import { useOrchestratorTheme } from '../../../hooks';
import { SortOrder } from '../../../types';
import {
    WfoBasicTableColumns,
    WfoBasicTableProps,
    WfoTableHeaderCell,
} from '../WfoBasicTable';
import type {
    TableColumnKeys,
    WfoDataSearch,
    WfoDataSorting,
} from '../utils/columns';

const dropDownTableStyle = (color: string) =>
    css({
        thead: {
            backgroundColor: `${color}`,
            'tr>:first-child': {
                borderTopLeftRadius: 0,
            },
            'tr>:last-child': {
                borderTopRightRadius: 0,
            },
        },
        tbody: {
            backgroundColor: `${color}`,
        },
    });

export const WfoDropdownTable = <T,>({
    data,
    columns,
    isLoading,
}: WfoBasicTableProps<T>) => {
    const allTableColumns = { ...columns };
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();

    return (
        <EuiBasicTable
            css={dropDownTableStyle(theme.colors.lightestShade)}
            items={data}
            columns={mapWfoTableColumnsToEuiColumns(allTableColumns)}
            loading={isLoading}
        />
    );
};

//can we move this outside so it can be reusable for other tables?
function mapWfoTableColumnsToEuiColumns<T>(
    tableColumns: WfoBasicTableColumns<T>,
    hiddenColumns?: TableColumnKeys<T>,
    dataSorting?: WfoDataSorting<T>,
    onDataSort?: (updatedDataSorting: WfoDataSorting<T>) => void,
    onDataSearch?: (updatedDataSearch: WfoDataSearch<T>) => void,
): EuiBasicTableColumn<T>[] {
    function isVisibleColumn(columnKey: string) {
        return !hiddenColumns?.includes(columnKey as keyof T);
    }

    function mapColumnKeyToEuiColumn(colKey: string): EuiBasicTableColumn<T> {
        const typedColumnKey = colKey as keyof T;
        const column: WfoBasicTableColumns<T>[keyof T] =
            tableColumns[typedColumnKey];
        const { name, render, width, description, sortable, filterable } =
            column;

        // In most cases columns are sortable and filterable, making them optional saves some lines in configuring the table
        const isSortable = sortable ?? true;
        const isFilterable = filterable ?? true;

        const sortOrder =
            dataSorting?.field === colKey ? dataSorting.sortOrder : undefined;

        const handleOnSetSortOrder = (updatedSortOrder: SortOrder) =>
            onDataSort?.({
                field: typedColumnKey,
                sortOrder: updatedSortOrder,
            });

        const handleOnSearch = (searchText: string) =>
            onDataSearch?.({
                field: typedColumnKey,
                searchText,
            });

        // Not spreading the column object here as it might contain additional props.
        // EUI does not handle extra props well.
        return {
            render,
            width,
            description,
            field: typedColumnKey,
            name: name && (
                <WfoTableHeaderCell
                    fieldName={typedColumnKey.toString()}
                    sortOrder={sortOrder}
                    onSetSortOrder={
                        isSortable ? handleOnSetSortOrder : undefined
                    }
                    onSearch={isFilterable ? handleOnSearch : undefined}
                >
                    {name}
                </WfoTableHeaderCell>
            ),
            truncateText: true,
            textOnly: true,
        };
    }

    return Object.keys(tableColumns)
        .filter(isVisibleColumn)
        .map(mapColumnKeyToEuiColumn);
}
