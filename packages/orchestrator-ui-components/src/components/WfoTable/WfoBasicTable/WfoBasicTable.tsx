import React, { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBasicTable, EuiBasicTableColumn, Pagination } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';
import { SerializedStyles } from '@emotion/react';

import type {
    TableColumnKeys,
    WfoDataSearch,
    WfoDataSorting,
} from '@/components';
import {
    WFO_STATUS_COLOR_FIELD,
    WfoTableControlColumnConfig,
    WfoTableDataColumnConfig,
} from '@/components';
import { WfoStatusColorField } from '@/components';
import { WfoTableHeaderCell } from '@/components';
import WfoTableCell from '@/components/WfoTable/WfoBasicTable/WfoTableCell';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { SortOrder } from '@/types';

import { getWfoBasicTableStyles } from './styles';

export type WfoBasicTableColumns<T extends object> = {
    [Property in keyof T]: WfoTableDataColumnConfig<T, Property> & {
        render?: (cellValue: T[Property], row: T) => ReactNode;
    };
};

export type WfoBasicTableColumnsWithControlColumns<T extends object> =
    WfoBasicTableColumns<T> & WfoTableControlColumnConfig<T>;

export type WfoBasicTableProps<T extends object> = {
    data: T[];
    columns:
        | WfoBasicTableColumnsWithControlColumns<T>
        | WfoBasicTableColumns<T>;
    hiddenColumns?: TableColumnKeys<T>;
    dataSorting?: WfoDataSorting<T>;
    pagination?: Pagination;
    isLoading?: boolean;
    onCriteriaChange?: (criteria: Criteria<T>) => void;
    onUpdateDataSorting?: (updatedDataSorting: WfoDataSorting<T>) => void;
    onDataSearch?: (updatedDataSearch: WfoDataSearch<T>) => void;
    getStatusColorForRow?: (row: T) => string;
    isExpandable?: boolean;
    itemIdToExpandedRowMap?: Record<string, ReactNode>;
    itemId?: string;
    customTableStyle?: SerializedStyles;
};

export const WfoBasicTable = <T extends object>({
    data,
    columns,
    hiddenColumns,
    dataSorting,
    pagination,
    isLoading,
    onCriteriaChange,
    onUpdateDataSorting,
    onDataSearch,
    getStatusColorForRow,
    isExpandable,
    itemIdToExpandedRowMap,
    itemId,
    customTableStyle,
}: WfoBasicTableProps<T>) => {
    const { theme } = useOrchestratorTheme();
    const { basicTableStyle } = useWithOrchestratorTheme(
        getWfoBasicTableStyles,
    );

    const t = useTranslations('common');

    const statusColorColumn: WfoTableControlColumnConfig<T> = {
        statusColorField: {
            field: WFO_STATUS_COLOR_FIELD,
            name: '',
            width: theme.size.xs,
            render: (_, row) =>
                getStatusColorForRow ? (
                    <WfoStatusColorField color={getStatusColorForRow(row)} />
                ) : (
                    <></>
                ),
        },
    };

    const allTableColumns:
        | WfoBasicTableColumnsWithControlColumns<T>
        | WfoBasicTableColumns<T> = getStatusColorForRow
        ? { ...statusColorColumn, ...columns }
        : { ...columns };

    const tableStyling = customTableStyle ?? basicTableStyle;

    return (
        <EuiBasicTable
            css={tableStyling}
            items={data}
            noItemsMessage={isLoading ? t('loading') : t('noItemsFound')}
            columns={mapWfoTableColumnsToEuiColumns(
                allTableColumns,
                hiddenColumns,
                dataSorting,
                onUpdateDataSorting,
                onDataSearch,
            )}
            pagination={pagination}
            onChange={onCriteriaChange}
            loading={isLoading}
            {...(isExpandable && {
                isExpandable,
                itemIdToExpandedRowMap,
                itemId,
            })}
        />
    );
};

function mapWfoTableColumnsToEuiColumns<T extends object>(
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
        const {
            name,
            render,
            width,
            description,
            sortable,
            filterable,
            truncateText,
            showTooltip,
        } = column;

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
            render: (value: T[keyof T], record: T) => (
                <WfoTableCell
                    value={value}
                    record={record}
                    render={render}
                    showTooltip={showTooltip}
                />
            ),
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
            truncateText: truncateText ?? true,
            textOnly: true,
        };
    }

    return Object.keys(tableColumns)
        .filter(isVisibleColumn)
        .map(mapColumnKeyToEuiColumn);
}
