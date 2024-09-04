import React, { CSSProperties, ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { EuiSpacer, EuiTablePagination, useEuiScrollBar } from '@elastic/eui';
import {
    DEFAULT_PAGE_SIZES,
    type TableColumnKeys,
    type WfoDataSearch,
    WfoDataSorting,
    useWithOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

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
};

export type WfoTableControlColumnConfigItem<T extends object> =
    CommonTableColumnConfigItemProps & {
        columnType: ColumnType.CONTROL;
        label?: string;
        renderControl: (row: T) => ReactNode;
    };

// Applying "Partial" since data should not always be shown in the table, but can still be needed for rendering
// Not providing a config for a property of T means that the column will not be shown
export type WfoTableColumnConfig<T extends object> = Partial<
    | {
          [Property in keyof T]: WfoTableDataColumnConfigItem<T, Property>;
      }
    | {
          [key: string]: WfoTableControlColumnConfigItem<T>;
      }
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

    return (
        <>
            <div css={[tableContainerStyle, useEuiScrollBar()]}>
                <table className={className} css={tableStyle}>
                    {overrideHeader ? (
                        overrideHeader(sortedVisibleColumns)
                    ) : (
                        <thead css={headerStyle}>
                            <WfoTableHeaderRow
                                columnConfig={columnConfig}
                                hiddenColumns={hiddenColumns}
                                columnOrder={columnOrder}
                                dataSorting={dataSorting}
                                onUpdateDataSorting={onUpdateDataSorting}
                                onUpdateDataSearch={onUpdateDataSearch}
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
                                columnConfig={columnConfig}
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
