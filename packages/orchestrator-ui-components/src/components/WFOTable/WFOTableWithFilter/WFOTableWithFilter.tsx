import React, { useState, useEffect } from 'react';
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
    WFOTableControlColumnConfig,
    WFOTableDataColumnConfig,
} from '../utils/columns';
import {
    ColumnConfig,
    TableConfig,
    TableSettingsModal,
} from '../WFOTableSettingsModal';
import { WFOSearchField } from '../../WFOSearchBar';
import {
    WFOBasicTable,
    WFOBasicTableColumnsWithControlColumns,
} from '../WFOBasicTable';
import { DEFAULT_PAGE_SIZES } from '../utils/constants';
import {
    clearTableConfigFromLocalStorage,
    setTableConfigToLocalStorage,
} from '../utils/tableConfigPersistence';
import { WFOInformationModal } from '../../WFOSettingsModal';
import {
    WFOKeyValueTable,
    WFOKeyValueTableDataType,
} from '../../WFOKeyValueTable/WFOKeyValueTable';
import { getTypedFieldFromObject } from '../../../utils';
import { WFOArrowsExpand } from '../../../icons';
import { useOrchestratorTheme } from '../../../hooks';

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
    detailModal?: boolean;
    detailModalTitle?: string;
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
    detailModal = true,
    detailModalTitle = 'Details',
    onUpdateEsQueryString,
    onUpdatePage,
    onUpdateDataSort,
}: WFOTableWithFilterProps<T>) => {
    const { theme } = useOrchestratorTheme();

    const defaultPageSize = pagination.pageSize;
    const [hiddenColumns, setHiddenColumns] =
        useState<TableColumnKeys<T>>(defaultHiddenColumns);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedDataForDetailModal, setSelectedDataForDetailModal] =
        useState<T | undefined>(undefined);

    useEffect(() => {
        if (defaultHiddenColumns) {
            setHiddenColumns(defaultHiddenColumns);
        }
    }, [defaultHiddenColumns]);

    const detailsIconColumn: WFOTableControlColumnConfig<T> = {
        viewDetails: {
            field: 'viewDetails',
            width: '36px',
            render: (_, row) => (
                <EuiFlexItem
                    css={{ cursor: 'pointer' }}
                    onClick={() => setSelectedDataForDetailModal(row)}
                >
                    <WFOArrowsExpand color={theme.colors.mediumShade} />
                </EuiFlexItem>
            ),
        },
    };

    const tableColumnsWithControlColumns: WFOBasicTableColumnsWithControlColumns<T> =
        {
            ...leadingControlColumns,
            ...tableColumns,
            ...trailingControlColumns,
            ...(detailModal ? detailsIconColumn : []),
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

    const rowDetailData: WFOKeyValueTableDataType[] | undefined =
        selectedDataForDetailModal &&
        Object.entries(tableColumns).map(([key]) => {
            const dataField = getTypedFieldFromObject(key, tableColumns);
            if (dataField === null) {
                return {
                    key,
                    value: undefined,
                };
            }

            const { renderDetails, render, clipboardText, name } =
                tableColumns[dataField];
            const dataValue = selectedDataForDetailModal[dataField];
            return {
                key: name ?? dataField.toString(),
                value: (renderDetails &&
                    renderDetails(dataValue, selectedDataForDetailModal)) ??
                    (render &&
                        render(dataValue, selectedDataForDetailModal)) ?? (
                        <>{dataValue}</>
                    ),
                plainTextValue:
                    clipboardText?.(dataValue, selectedDataForDetailModal) ??
                    (typeof dataValue === 'string' ? dataValue : undefined),
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
            <WFOBasicTable
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
                        selectedPageSize: pagination.pageSize,
                    }}
                    pageSizeOptions={
                        pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZES
                    }
                    onClose={() => setShowSettingsModal(false)}
                    onUpdateTableConfig={handleUpdateTableConfig}
                    onResetToDefaults={handleResetToDefaults}
                />
            )}

            {rowDetailData && (
                <WFOInformationModal
                    title={detailModalTitle}
                    onClose={() => setSelectedDataForDetailModal(undefined)}
                >
                    <WFOKeyValueTable
                        keyValues={rowDetailData}
                        showCopyToClipboardIcon
                    />
                </WFOInformationModal>
            )}
        </>
    );
};
