import React, { ReactNode, useEffect, useState } from 'react';

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
    TableConfig,
    TableSettingsColumnConfig,
    TableSettingsModal,
    WfoErrorWithMessage,
    WfoInformationModal,
    WfoKeyValueTable,
    WfoKeyValueTableDataType,
    WfoSearchField,
    clearTableConfigFromLocalStorage,
    setTableConfigToLocalStorage,
} from '@/components';
import {
    ColumnType,
    WfoTable,
    WfoTableControlColumnConfig,
    WfoTableControlColumnConfigItem,
    WfoTableDataColumnConfigItem,
    WfoTableProps,
} from '@/components/WfoTable/WfoTable/WfoTable';
import { updateQueryString } from '@/components/WfoTable/WfoTableWithFilter/updateQueryString';
import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';
import { WfoGraphqlError } from '@/rtk';
import { getTypedFieldFromObject } from '@/utils';
import { getDefaultTableConfig } from '@/utils/getDefaultTableConfig';

// These types are expanding the config of the basic table -- todo move to other file
export type WfoAdvancedTableDataColumnConfigItem<
    T extends object,
    Property extends keyof T,
> = WfoTableDataColumnConfigItem<T, Property> & {
    renderDetails?: (cellValue: T[Property], row: T) => ReactNode;
    clipboardText?: (cellValue: T[Property], row: T) => string;
};
export type WfoAdvancedTableDataColumnConfig<T extends object> = {
    [Property in keyof T]: WfoAdvancedTableDataColumnConfigItem<T, Property>;
};
export type WfoAdvancedTableColumnConfig<T extends object> = Partial<
    WfoTableControlColumnConfig<T> | WfoAdvancedTableDataColumnConfig<T>
>;
// ---- End of expanded types

// Todo move to utils
const getRowDetailData = <T extends object>(
    selectedDataForDetailModal: T | undefined,
    tableColumnConfig: WfoAdvancedTableColumnConfig<T>,
) => {
    if (!selectedDataForDetailModal) {
        return undefined;
    }

    const tableColumnConfigEntries: [
        string,
        (
            | WfoTableControlColumnConfigItem<T>
            | WfoAdvancedTableDataColumnConfigItem<T, keyof T>
        ),
    ][] = Object.entries(tableColumnConfig);

    const dataColumnEntries = tableColumnConfigEntries.filter(
        (tableColumnConfigEntry) =>
            tableColumnConfigEntry[1].columnType === ColumnType.DATA,
    ) as [string, WfoAdvancedTableDataColumnConfigItem<T, keyof T>][];

    return dataColumnEntries.map(([key, value]) => {
        const dataField = getTypedFieldFromObject(key, tableColumnConfig);
        if (dataField === null) {
            return {
                key,
                value: undefined,
            };
        }

        const { renderDetails, renderData, clipboardText, label } = value;
        const dataValue = selectedDataForDetailModal[dataField];

        return {
            key: label ?? dataField.toString(),
            value: (renderDetails &&
                renderDetails(dataValue, selectedDataForDetailModal)) ??
                (renderData &&
                    renderData(dataValue, selectedDataForDetailModal)) ?? (
                    <>{dataValue}</>
                ),
            textToCopy:
                clipboardText?.(dataValue, selectedDataForDetailModal) ??
                (typeof dataValue === 'string' ? dataValue : undefined),
        };
    });
};

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
                    <WfoArrowsExpand color={theme.colors.mediumShade} />
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
    ).map((keyValuePair) => {
        const field = keyValuePair[0] as keyof T;

        const { label: name } = keyValuePair[1];
        return {
            field,
            name,
            isVisible: hiddenColumns.indexOf(field) === -1,
        };
    });

    const rowDetailData: WfoKeyValueTableDataType[] | undefined =
        getRowDetailData(selectedDataForDetailModal, tableColumnConfig);

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

    // Todo: try to move out of this component
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
