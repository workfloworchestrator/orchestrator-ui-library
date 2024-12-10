import React, { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { EuiSpacer, EuiTablePagination, useEuiScrollBar } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import {
    TableColumnKeys,
    WfoDataSearch,
    WfoDataSorting,
} from '../utils/columns';
import { DEFAULT_PAGE_SIZES } from '../utils/constants';
import { WfoTableDataRows } from './WfoTableDataRows';
import { WfoTableHeaderRow } from './WfoTableHeaderRow';
import { getWfoTableStyles } from './styles';
import { getSortedVisibleColumns } from './utils';

export type Pagination = {
    pageSize: number;
    pageIndex: number;
    totalItemCount: number;
    pageSizeOptions?: number[];
    onChangeItemsPerPage?: (pageSize: number) => void;
    onChangePage?: (pageIndex: number) => void;
};

export enum ColumnType {
    DATA = 'data',
    CONTROL = 'control',
}

type CommonTableColumnConfigItemProps = {
    numberOfColumnsToSpan?: number;
    disableDefaultCellStyle?: boolean;
    width?: CSSProperties['width'];
};

export type WfoTableDataColumnConfigItem<
    T extends object,
    Property extends keyof T,
> = CommonTableColumnConfigItemProps & {
    columnType: ColumnType.DATA;
    label: string;
    isSortable?: boolean;
    isFilterable?: boolean;
    renderData?: (cellValue: T[Property], row: T) => ReactNode;
    renderTooltip?: (cellValue: T[Property], row: T) => ReactNode;
};

export type WfoTableControlColumnConfigItem<T extends object> =
    CommonTableColumnConfigItemProps & {
        columnType: ColumnType.CONTROL;
        label?: string;
        renderControl: (row: T) => ReactNode;
    };

export type WfoTableDataColumnConfig<T extends object> = {
    [Property in keyof T]:
        | WfoTableDataColumnConfigItem<T, Property>
        | WfoTableControlColumnConfigItem<T>;
};

export type WfoTableControlColumnConfig<T extends object> = {
    [key: string]: WfoTableControlColumnConfigItem<T>; // from WfoTableColumnConfig -- consider extracting type
};

// Applying "Partial" since data should not always be shown in the table, but can still be needed for rendering
// Not providing a config for a property of T means that the column will not be shown in the table
export type WfoTableColumnConfig<T extends object> = Partial<
    WfoTableDataColumnConfig<T> | WfoTableControlColumnConfig<T>
>;

export type WfoTableProps<T extends object> = {
    data: T[];
    columnConfig: WfoTableColumnConfig<T>;
    hiddenColumns?: TableColumnKeys<T>;
    columnOrder?: TableColumnKeys<T>;
    isLoading?: boolean;
    dataSorting?: WfoDataSorting<T>[];
    rowExpandingConfiguration?: {
        uniqueRowId: keyof WfoTableColumnConfig<T>;
        uniqueRowIdToExpandedRowMap: Record<string, ReactNode>;
    };
    pagination?: Pagination;
    overrideHeader?: (
        tableHeaderEntries: Array<
            [
                string,
                (
                    | WfoTableControlColumnConfigItem<T>
                    | WfoTableDataColumnConfigItem<T, keyof T>
                ),
            ]
        >,
    ) => ReactNode;
    onRowClick?: (row: T) => void;
    onUpdateDataSorting?: (updatedDataSorting: WfoDataSorting<T>) => void;
    onUpdateDataSearch?: (updatedDataSearch: WfoDataSearch<T>) => void;
    className?: string;
};

type LocalColumnWidths = {
    [key: string]: string;
};

export const WfoTable = <T extends object>({
    data,
    columnConfig,
    hiddenColumns = [],
    columnOrder = [],
    isLoading = false,
    dataSorting = [],
    rowExpandingConfiguration,
    pagination,
    overrideHeader,
    onUpdateDataSorting,
    onUpdateDataSearch,
    onRowClick,
    className,
}: WfoTableProps<T>) => {
    const getColumnWidthsFromConfig = (
        columnConfig: WfoTableColumnConfig<T>,
    ): LocalColumnWidths => {
        return Object.entries(columnConfig).reduce(
            (columnWidths, [key, config]) => {
                if (config.columnType === ColumnType.DATA) {
                    columnWidths[key] = config.width ?? 'auto';
                }
                return columnWidths;
            },
            {} as LocalColumnWidths,
        );
    };

    const [localColumnWidths, setLocalColumnWidths] =
        useState<LocalColumnWidths>(getColumnWidthsFromConfig(columnConfig));

    const {
        tableContainerStyle,
        tableStyle,
        headerStyle,
        bodyLoadingStyle,
        cellStyle,
        rowStyle,
        emptyTableMessageStyle,
    } = useWithOrchestratorTheme(getWfoTableStyles);
    const t = useTranslations('common');

    const sortedVisibleColumns = getSortedVisibleColumns(
        columnConfig,
        columnOrder,
        hiddenColumns,
    );

    const onUpdateColumWidth = (fieldName: string, width: number) => {
        setLocalColumnWidths((localWidths) => {
            return {
                ...localWidths,
                [fieldName]: `${width}px`,
            };
        });
    };

    const configWithLocalWidths: WfoTableColumnConfig<T> = Object.entries(
        columnConfig,
    ).reduce((mergedConfig, [fieldName, fieldConfig]) => {
        const key = fieldName as keyof WfoTableColumnConfig<T>;
        if (fieldConfig.columnType === ColumnType.DATA) {
            mergedConfig[key] = {
                ...fieldConfig,
                width: localColumnWidths[key],
            };
        } else {
            mergedConfig[key] = fieldConfig;
        }
        return mergedConfig;
    }, {} as WfoTableColumnConfig<T>);

    return (
        <>
            <div css={[tableContainerStyle, useEuiScrollBar()]}>
                <table className={className} css={tableStyle}>
                    {overrideHeader ? (
                        overrideHeader(sortedVisibleColumns)
                    ) : (
                        <thead css={headerStyle}>
                            <WfoTableHeaderRow
                                columnConfig={configWithLocalWidths}
                                hiddenColumns={hiddenColumns}
                                columnOrder={columnOrder}
                                dataSorting={dataSorting}
                                onUpdateDataSorting={onUpdateDataSorting}
                                onUpdateDataSearch={onUpdateDataSearch}
                                onUpdateColumWidth={onUpdateColumWidth}
                            />
                        </thead>
                    )}
                    {data.length === 0 ? (
                        <tbody css={isLoading && bodyLoadingStyle}>
                            <tr css={rowStyle}>
                                <td
                                    colSpan={sortedVisibleColumns.length}
                                    css={[cellStyle, emptyTableMessageStyle]}
                                >
                                    {isLoading
                                        ? t('loading')
                                        : t('noItemsFound')}
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody css={isLoading && bodyLoadingStyle}>
                            <WfoTableDataRows
                                data={data}
                                columnConfig={configWithLocalWidths}
                                hiddenColumns={hiddenColumns}
                                columnOrder={columnOrder}
                                rowExpandingConfiguration={
                                    rowExpandingConfiguration
                                }
                                onRowClick={onRowClick}
                            />
                        </tbody>
                    )}
                </table>
            </div>
            {pagination && (
                <>
                    <EuiSpacer size="xs" />
                    <EuiTablePagination
                        pageCount={Math.ceil(
                            pagination.totalItemCount / pagination.pageSize,
                        )}
                        activePage={pagination.pageIndex}
                        itemsPerPage={pagination.pageSize}
                        itemsPerPageOptions={
                            pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZES
                        }
                        onChangePage={pagination.onChangePage}
                        onChangeItemsPerPage={pagination.onChangeItemsPerPage}
                    />
                </>
            )}
        </>
    );
};
