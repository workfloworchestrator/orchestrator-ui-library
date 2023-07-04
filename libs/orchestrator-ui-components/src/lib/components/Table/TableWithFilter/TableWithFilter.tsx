import React, { useState } from 'react';
import {
    Criteria,
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    Pagination,
} from '@elastic/eui';
import {
    DataSorting,
    TableColumns,
    TableColumnsWithControlColumns,
    TableControlColumnConfig,
    TableDataColumnConfig,
} from '../columns';
import { ColumnConfig, TableSettingsModal } from '../TableSettingsModal';
import { SearchField } from '../../SearchBar';
import { Table } from '../Table';
import { DEFAULT_PAGE_SIZES } from '../constants';

export type TableWithFilterProps<T> = {
    data: T[];
    tableColumns: TableColumns<T>;
    leadingControlColumns?: TableControlColumnConfig<T>;
    trailingControlColumns?: TableControlColumnConfig<T>;
    defaultHiddenColumns: Array<keyof T>;
    dataSorting: DataSorting<T>;
    pagination: Pagination;
    filterQuery: string;
    isInvalidFilterQuery: boolean;
    isLoading: boolean;
    onUpdateFilterQuery: (updatedFilterQuery: string) => void;
    onCriteriaChange: ({ page }: Criteria<T>) => void;
    onUpdatePageSize: (updatedPageSize: number) => void;
    onResetPageSize: () => void;
    onUpdateDataSort: (newSortColumnId: keyof T) => void;
};

export const TableWithFilter = <T,>({
    data,
    tableColumns,
    leadingControlColumns,
    trailingControlColumns,
    defaultHiddenColumns,
    dataSorting,
    pagination,
    filterQuery,
    isInvalidFilterQuery,
    isLoading,
    onUpdateFilterQuery,
    onCriteriaChange,
    onUpdatePageSize,
    onResetPageSize,
    onUpdateDataSort,
}: TableWithFilterProps<T>) => {
    const [hiddenColumns, setHiddenColumns] =
        useState<Array<keyof T>>(defaultHiddenColumns);
    const [showModal, setShowModal] = useState(false);

    const tableSettingsColumns: ColumnConfig<T>[] = Object.entries<
        TableDataColumnConfig<T, keyof T>
    >(tableColumns).map((keyValuePair) => {
        const { field, name } = keyValuePair[1];
        return {
            field,
            name,
            isVisible: hiddenColumns.indexOf(field) === -1,
        };
    });

    const tableColumnsWithControlColumns: TableColumnsWithControlColumns<T> = {
        ...leadingControlColumns,
        ...tableColumns,
        ...trailingControlColumns,
    };

    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <SearchField
                        filterQuery={filterQuery}
                        onUpdateFilterQuery={onUpdateFilterQuery}
                        isInvalid={isInvalidFilterQuery}
                    />
                </EuiFlexItem>
                <EuiButton onClick={() => setShowModal(true)}>
                    Edit columns
                </EuiButton>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <Table
                data={data}
                columns={tableColumnsWithControlColumns}
                hiddenColumns={hiddenColumns}
                dataSorting={dataSorting}
                onDataSort={onUpdateDataSort}
                pagination={pagination}
                isLoading={isLoading}
                onCriteriaChange={onCriteriaChange}
            />

            {showModal && (
                <TableSettingsModal
                    tableConfig={{
                        columns: tableSettingsColumns,
                        selectedPageSize: pagination.pageSize,
                    }}
                    pageSizeOptions={
                        pagination.pageSizeOptions || DEFAULT_PAGE_SIZES
                    }
                    onClose={() => setShowModal(false)}
                    onUpdateTableConfig={(updatedTableConfig) => {
                        const updatedHiddenColumns = updatedTableConfig.columns
                            .filter((column) => !column.isVisible)
                            .map((hiddenColumn) => hiddenColumn.field);
                        setHiddenColumns(updatedHiddenColumns);
                        onUpdatePageSize(updatedTableConfig.selectedPageSize);
                        setShowModal(false);
                    }}
                    onResetToDefaults={() => {
                        setHiddenColumns(defaultHiddenColumns);
                        onResetPageSize();
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
};
