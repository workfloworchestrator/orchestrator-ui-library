import React, { useEffect, useState } from 'react';
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
    disableDetailModal?: boolean;
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
    disableDetailModal = false,
    onUpdateEsQueryString,
    onUpdatePage,
    onUpdateDataSort,
}: WFOTableWithFilterProps<T>) => {
    const { theme } = useOrchestratorTheme();

    const defaultPageSize = pagination.pageSize;
    const tableConfigFromLocalStorage =
        getTableConfigFromLocalStorage<T>(localStorageKey);

    const initialHiddenColumns =
        tableConfigFromLocalStorage?.hiddenColumns ?? defaultHiddenColumns;

    const [hiddenColumns, setHiddenColumns] =
        useState<TableColumnKeys<T>>(initialHiddenColumns);

    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedDataForDetailModal, setSelectedDataForDetailModal] =
        useState<T | undefined>(undefined);

    useEffect(() => {
        setHiddenColumns(
            tableConfigFromLocalStorage?.hiddenColumns ?? defaultHiddenColumns,
        );
    }, [localStorageKey]);

    const viewDetailsColumn: WFOTableControlColumnConfig<T> = {
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

    const tableColumnsWithControlColumns: WFOTableColumnsWithControlColumns<T> =
        disableDetailModal
            ? {
                  ...leadingControlColumns,
                  ...tableColumns,
                  ...trailingControlColumns,
              }
            : {
                  ...leadingControlColumns,
                  ...tableColumns,
                  ...trailingControlColumns,
                  ...viewDetailsColumn,
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

    const processDetailData: WFOKeyValueTableDataType[] | undefined =
        selectedDataForDetailModal &&
        Object.entries(selectedDataForDetailModal).map(([key, value]) => {
            const dataField = getTypedFieldFromObject(key, tableColumns);
            if (dataField === null) {
                return {
                    key,
                    value: <>{value}</>,
                    plainTextValue:
                        typeof value === 'string' ? value : undefined,
                };
            }

            const { renderDetails, render, clipboardText } =
                tableColumns[dataField];
            const dataValue = selectedDataForDetailModal[dataField];
            return {
                key: dataField.toString(),
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

            {processDetailData && (
                <WFOInformationModal
                    title={'Details - Process'}
                    onClose={() => setSelectedDataForDetailModal(undefined)}
                >
                    <WFOKeyValueTable
                        keyValues={processDetailData}
                        showCopyToClipboardIcon
                    />
                </WFOInformationModal>
            )}
        </>
    );
};
