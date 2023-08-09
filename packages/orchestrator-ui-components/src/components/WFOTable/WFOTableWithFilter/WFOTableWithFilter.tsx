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
    WFODataSorting,
    TableColumnKeys,
    WFOTableColumns,
    WFOTableColumnsWithControlColumns,
    WFOTableControlColumnConfig,
    WFOTableDataColumnConfig,
} from '../utils/columns';
import {
    ColumnConfig,
    TableConfig,
    TableSettingsModal,
} from '../WFOTableSettingsModal';
import { WFOSearchField } from '../../WFOSearchBar';
import { WFOTable } from '../WFOTable';
import { DEFAULT_PAGE_SIZES } from '../utils/constants';
import {
    clearTableConfigFromLocalStorage,
    getTableConfigFromLocalStorage,
    setTableConfigToLocalStorage,
} from '../utils/tableConfigPersistence';

export type WFOTableWithFilterProps<T> = {
    data: T[];
    tableColumns: WFOTableColumns<T>;
    leadingControlColumns?: WFOTableControlColumnConfig<T>;
    trailingControlColumns?: WFOTableControlColumnConfig<T>;
    defaultHiddenColumns?: TableColumnKeys<T>;
    dataSorting: WFODataSorting<T>;
    pagination: Pagination;
    esQueryString?: string;
    isLoading: boolean;
    localStorageKey: string;
    onUpdateEsQueryString: (esQueryString: string) => void;
    onUpdatePage: (criterion: Criteria<T>['page']) => void;
    onUpdateDataSort: (newSortColumnId: keyof T) => void;
};

export const WFOTableWithFilter = <T,>({
    data,
    tableColumns,
    leadingControlColumns,
    trailingControlColumns,
    defaultHiddenColumns = [],
    dataSorting,
    pagination,
    esQueryString,
    isLoading,
    localStorageKey,
    onUpdateEsQueryString,
    onUpdatePage,
    onUpdateDataSort,
}: WFOTableWithFilterProps<T>) => {
    const defaultPageSize = pagination.pageSize;
    const tableConfigFromLocalStorage =
        getTableConfigFromLocalStorage<T>(localStorageKey);

    const initialHiddenColumns =
        tableConfigFromLocalStorage?.hiddenColumns ?? defaultHiddenColumns;

    const [hiddenColumns, setHiddenColumns] =
        useState<TableColumnKeys<T>>(initialHiddenColumns);

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const tableColumnsWithControlColumns: WFOTableColumnsWithControlColumns<T> =
        {
            ...leadingControlColumns,
            ...tableColumns,
            ...trailingControlColumns,
        };

    const tableSettingsColumns: ColumnConfig<T>[] = Object.entries<
        WFOTableDataColumnConfig<T, keyof T>
    >(tableColumns).map((keyValuePair) => {
        const { field, name } = keyValuePair[1];
        return {
            field,
            name,
            isVisible: hiddenColumns.indexOf(field) === -1,
        };
    });

    const handleUpdateTableConfig = (updatedTableConfig: TableConfig<T>) => {
        const updatedHiddenColumns = updatedTableConfig.columns
            .filter((column) => !column.isVisible)
            .map((hiddenColumn) => hiddenColumn.field);
        setHiddenColumns(updatedHiddenColumns);
        setShowSettingsModal(false);
        setTableConfigToLocalStorage(localStorageKey, {
            hiddenColumns: updatedHiddenColumns,
            selectedPageSize: updatedTableConfig.selectedPageSize,
        });
        onUpdatePage({
            index: 0,
            size: updatedTableConfig.selectedPageSize,
        });
    };

    const handleResetToDefaults = () => {
        setHiddenColumns(defaultHiddenColumns);
        setShowSettingsModal(false);
        clearTableConfigFromLocalStorage(localStorageKey);
        onUpdatePage({
            index: 0,
            size: defaultPageSize,
        });
    };

    const onCriteriaChange = (criterion: Criteria<T>) => {
        if (criterion.page) {
            onUpdatePage(criterion.page);
        }
    };

    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <WFOSearchField
                        esQueryString={esQueryString}
                        onUpdateEsQueryString={onUpdateEsQueryString}
                    />
                </EuiFlexItem>
                <EuiButton onClick={() => setShowSettingsModal(true)}>
                    Edit columns
                </EuiButton>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <WFOTable
                data={data}
                columns={tableColumnsWithControlColumns}
                hiddenColumns={hiddenColumns}
                dataSorting={dataSorting}
                onDataSort={onUpdateDataSort}
                pagination={pagination}
                isLoading={isLoading}
                onCriteriaChange={onCriteriaChange}
            />

            {showSettingsModal && (
                <TableSettingsModal
                    tableConfig={{
                        columns: tableSettingsColumns,
                        selectedPageSize:
                            tableConfigFromLocalStorage?.selectedPageSize ??
                            pagination.pageSize,
                    }}
                    pageSizeOptions={
                        pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZES
                    }
                    onClose={() => setShowSettingsModal(false)}
                    onUpdateTableConfig={handleUpdateTableConfig}
                    onResetToDefaults={handleResetToDefaults}
                />
            )}
        </>
    );
};
