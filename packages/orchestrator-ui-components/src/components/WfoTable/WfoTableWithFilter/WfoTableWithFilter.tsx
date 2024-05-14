import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    Criteria,
    EuiButton,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
    Pagination,
} from '@elastic/eui';

import { WfoError } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';

import { getTypedFieldFromObject } from '../../../utils';
import {
    WfoKeyValueTable,
    WfoKeyValueTableDataType,
} from '../../WfoKeyValueTable/WfoKeyValueTable';
import { WfoSearchField } from '../../WfoSearchBar';
import { WfoInformationModal } from '../../WfoSettingsModal';
import {
    WfoBasicTable,
    WfoBasicTableColumnsWithControlColumns,
} from '../WfoBasicTable';
import {
    ColumnConfig,
    TableConfig,
    TableSettingsModal,
} from '../WfoTableSettingsModal';
import {
    TableColumnKeys,
    WfoDataSorting,
    WfoTableColumns,
    WfoTableControlColumnConfig,
    WfoTableDataColumnConfig,
} from '../utils/columns';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZES } from '../utils/constants';
import {
    clearTableConfigFromLocalStorage,
    setTableConfigToLocalStorage,
} from '../utils/tableConfigPersistence';
import { updateQueryString } from './updateQueryString';

export type WfoTableWithFilterProps<T extends object> = {
    data: T[];
    tableColumns: WfoTableColumns<T>;
    leadingControlColumns?: WfoTableControlColumnConfig<T>;
    trailingControlColumns?: WfoTableControlColumnConfig<T>;
    defaultHiddenColumns?: TableColumnKeys<T>;
    dataSorting: WfoDataSorting<T>;
    pagination: Pagination;
    queryString?: string;
    isLoading: boolean;
    localStorageKey: string;
    detailModal?: boolean;
    detailModalTitle?: string;
    onUpdateQueryString: (queryString: string) => void;
    onUpdatePage: (criterion: Criteria<T>['page']) => void;
    onUpdateDataSort: (dataSorting: WfoDataSorting<T>) => void;
    hasError?: boolean;
    onExportData?: () => void;
    exportDataIsLoading?: boolean;
};

export const WfoTableWithFilter = <T extends object>({
    data,
    tableColumns,
    leadingControlColumns,
    trailingControlColumns,
    defaultHiddenColumns = [],
    dataSorting,
    pagination,
    queryString,
    isLoading,
    localStorageKey,
    detailModal = true,
    detailModalTitle = 'Details',
    onUpdateQueryString,
    onUpdatePage,
    onUpdateDataSort,
    hasError = false,
    onExportData,
    exportDataIsLoading = false,
}: WfoTableWithFilterProps<T>) => {
    const { theme } = useOrchestratorTheme();

    const defaultPageSize = pagination.pageSize;
    const [hiddenColumns, setHiddenColumns] =
        useState<TableColumnKeys<T>>(defaultHiddenColumns);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedDataForDetailModal, setSelectedDataForDetailModal] =
        useState<T | undefined>(undefined);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const t = useTranslations('common');

    useEffect(() => {
        if (defaultHiddenColumns) {
            setHiddenColumns(defaultHiddenColumns);
        }
    }, [defaultHiddenColumns]);

    const detailsIconColumn: WfoTableControlColumnConfig<T> = {
        viewDetails: {
            field: 'viewDetails',
            width: '36px',
            render: (_, row) => (
                <EuiFlexItem
                    css={{ cursor: 'pointer' }}
                    onClick={() => setSelectedDataForDetailModal(row)}
                >
                    <WfoArrowsExpand color={theme.colors.mediumShade} />
                </EuiFlexItem>
            ),
        },
    };

    const tableColumnsWithControlColumns: WfoBasicTableColumnsWithControlColumns<T> =
        {
            ...leadingControlColumns,
            ...tableColumns,
            ...trailingControlColumns,
            ...(detailModal ? detailsIconColumn : []),
        };

    const tableSettingsColumns: ColumnConfig<T>[] = Object.entries<
        WfoTableDataColumnConfig<T, keyof T>
    >(tableColumns).map((keyValuePair) => {
        const { field, name } = keyValuePair[1];
        return {
            field,
            name,
            isVisible: hiddenColumns.indexOf(field) === -1,
        };
    });

    const rowDetailData: WfoKeyValueTableDataType[] | undefined =
        selectedDataForDetailModal &&
        Object.entries(tableColumns).map(([key]): WfoKeyValueTableDataType => {
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
                textToCopy:
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
            size: defaultPageSize ?? DEFAULT_PAGE_SIZE,
        });
    };

    const onCriteriaChange = (criterion: Criteria<T>) => {
        if (criterion.page) {
            onUpdatePage(criterion.page);
        }
    };

    if (hasError) {
        return <WfoError />;
    }

    const searchModalText = t.rich('searchModalText', {
        br: () => <br />,
        p: (chunks) => <p>{chunks}</p>,
        ul: (chunks) => <ul>{chunks}</ul>,
        li: (chunks) => <li>{chunks}</li>,
        span: (chunks) => <span>{chunks}</span>,
        b: (chunks) => <b>{chunks}</b>,
    });

    return (
        <>
            <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                    <WfoSearchField
                        queryString={queryString}
                        onUpdateQueryString={onUpdateQueryString}
                    />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        onClick={() => setShowSearchModal(true)}
                        iconSize={'xl'}
                        iconType={'iInCircle'}
                        aria-label={t('searchModalTitle')}
                    />
                </EuiFlexItem>
                <EuiButton onClick={() => setShowSettingsModal(true)}>
                    {t('editColumns')}
                </EuiButton>
                {onExportData && (
                    <EuiButton
                        isLoading={exportDataIsLoading}
                        onClick={() => onExportData()}
                    >
                        {t('export')}
                    </EuiButton>
                )}
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <WfoBasicTable
                data={data}
                columns={tableColumnsWithControlColumns}
                hiddenColumns={hiddenColumns}
                dataSorting={dataSorting}
                onUpdateDataSorting={onUpdateDataSort}
                pagination={pagination}
                isLoading={isLoading}
                onCriteriaChange={onCriteriaChange}
                onDataSearch={({ field, searchText }) =>
                    onUpdateQueryString(
                        updateQueryString(
                            queryString ?? '',
                            field.toString(),
                            searchText,
                        ),
                    )
                }
            />

            {showSettingsModal && (
                <TableSettingsModal
                    tableConfig={{
                        columns: tableSettingsColumns,
                        selectedPageSize:
                            pagination.pageSize ?? DEFAULT_PAGE_SIZE,
                    }}
                    pageSizeOptions={
                        pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZES
                    }
                    onClose={() => setShowSettingsModal(false)}
                    onUpdateTableConfig={handleUpdateTableConfig}
                    onResetToDefaults={handleResetToDefaults}
                />
            )}

            {showSearchModal && (
                <WfoInformationModal
                    title={t('searchModalTitle')}
                    onClose={() => setShowSearchModal(false)}
                >
                    <EuiText>
                        <p>{searchModalText}</p>
                    </EuiText>
                </WfoInformationModal>
            )}

            {rowDetailData && (
                <WfoInformationModal
                    title={detailModalTitle}
                    onClose={() => setSelectedDataForDetailModal(undefined)}
                >
                    <WfoKeyValueTable
                        keyValues={rowDetailData}
                        showCopyToClipboardIcon
                    />
                </WfoInformationModal>
            )}
        </>
    );
};
