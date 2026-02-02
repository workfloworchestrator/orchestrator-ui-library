import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    TableColumnKeys,
    TableSettingsColumnConfig,
    TableSettingsConfig,
    TableSettingsModal,
    WfoErrorWithMessage,
    WfoInformationModal,
    WfoKeyValueTable,
    WfoKeyValueTableDataType,
    WfoSearchField,
    clearTableConfigFromLocalStorage,
    setTableConfigToLocalStorage,
} from '@/components';
import { getRowDetailData } from '@/components/WfoTable/WfoAdvancedTable/getRowDetailData';
import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';
import { WfoGraphqlError } from '@/rtk';
import { getDefaultTableConfig } from '@/utils';

import { ColumnType, WfoTable, WfoTableProps } from '../WfoTable';
import { updateQueryString } from '../WfoTableWithFilter/updateQueryString';
import { WfoAdvancedTableColumnConfig } from './types';

export type WfoAdvancedTableProps<T extends object> = Omit<
    WfoTableProps<T>,
    'columnConfig'
> & {
    tableColumnConfig: WfoAdvancedTableColumnConfig<T>;
    defaultHiddenColumns?: TableColumnKeys<T>;
    queryString?: string;
    localStorageKey: string;
    detailModal?: boolean;
    detailModalTitle?: string;
    exportDataIsLoading?: boolean;
    error?: WfoGraphqlError[];
    onUpdateQueryString: (queryString: string) => void;
    onExportData?: () => void;
    disableSearch?: boolean;
};

export const WfoAdvancedTable = <T extends object>({
    tableColumnConfig,
    defaultHiddenColumns = [],
    queryString,
    localStorageKey,
    detailModal = true,
    detailModalTitle = 'Details',
    exportDataIsLoading,
    error,
    onUpdateQueryString,
    onExportData,
    disableSearch = false,
    ...tableProps
}: WfoAdvancedTableProps<T>) => {
    const { theme } = useOrchestratorTheme();

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

    const { pagination } = tableProps;

    const detailsIconColumn: WfoAdvancedTableColumnConfig<T> = {
        viewDetails: {
            columnType: ColumnType.CONTROL,
            width: '36px',
            renderControl: (row) => (
                <EuiFlexItem
                    css={{ cursor: 'pointer' }}
                    onClick={() => setSelectedDataForDetailModal(row)}
                >
                    <WfoArrowsExpand color={theme.colors.borderBasePlain} />
                </EuiFlexItem>
            ),
        },
    };

    const tableColumnsWithControlColumns: WfoAdvancedTableColumnConfig<T> = {
        ...(detailModal && detailsIconColumn),
        ...tableColumnConfig,
    };

    const tableSettingsColumns: TableSettingsColumnConfig<T>[] = Object.entries(
        tableColumnConfig,
    ).map(([key, { label }]): TableSettingsColumnConfig<T> => {
        const field = key as keyof T;

        return {
            field,
            name: label,
            isVisible: hiddenColumns.indexOf(field) === -1,
        };
    });

    const rowDetailData: WfoKeyValueTableDataType[] | undefined =
        selectedDataForDetailModal &&
        getRowDetailData(selectedDataForDetailModal, tableColumnConfig);

    const handleUpdateTableConfig = (
        updatedTableConfig: TableSettingsConfig<T>,
    ) => {
        const updatedHiddenColumns = updatedTableConfig.columns
            .filter((column) => !column.isVisible)
            .map((hiddenColumn) => hiddenColumn.field);
        setHiddenColumns(updatedHiddenColumns);
        setShowSettingsModal(false);
        setTableConfigToLocalStorage(localStorageKey, {
            hiddenColumns: updatedHiddenColumns,
            selectedPageSize: updatedTableConfig.selectedPageSize,
        });
        pagination?.onChangeItemsPerPage?.(updatedTableConfig.selectedPageSize);
        pagination?.onChangePage?.(0);
    };

    const handleResetToDefaults = () => {
        const defaultTableConfig = getDefaultTableConfig<T>(localStorageKey);
        setHiddenColumns(defaultTableConfig.hiddenColumns);
        setShowSettingsModal(false);
        clearTableConfigFromLocalStorage(localStorageKey);
        pagination?.onChangeItemsPerPage?.(
            defaultTableConfig.selectedPageSize ?? DEFAULT_PAGE_SIZE,
        );
        pagination?.onChangePage?.(0);
    };

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
                    {!disableSearch && (
                        <WfoSearchField
                            queryString={queryString}
                            onUpdateQueryString={onUpdateQueryString}
                        />
                    )}
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    {!disableSearch && (
                        <EuiButtonIcon
                            onClick={() => setShowSearchModal(true)}
                            iconSize={'xl'}
                            iconType={'info'}
                            aria-label={t('searchModalTitle')}
                        />
                    )}
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
            {error && <WfoErrorWithMessage error={error} />}
            <EuiSpacer size="m" />
            <WfoTable
                columnConfig={tableColumnsWithControlColumns}
                hiddenColumns={hiddenColumns}
                onUpdateDataSearch={({ field, searchText }) =>
                    onUpdateQueryString(
                        updateQueryString(
                            queryString ?? '',
                            field.toString(),
                            searchText,
                        ),
                    )
                }
                {...tableProps}
            />

            {showSettingsModal && (
                <TableSettingsModal
                    tableConfig={{
                        columns: tableSettingsColumns,
                        selectedPageSize:
                            pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
                    }}
                    pageSizeOptions={
                        pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZES
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
