import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiButtonEmpty, EuiCheckbox, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZES,
  TableColumnKeys,
  TableSettingsConfig,
  TableSettingsModal,
  WfoDataSearch,
  WfoDataSorting,
  WfoErrorWithMessage,
  WfoInformationModal,
  WfoKeyValueTable,
  WfoKeyValueTableDataType,
  clearTableConfigFromLocalStorage,
  getTableSettingsColumns,
  setTableConfigToLocalStorage,
} from '@/components';
import { getRowDetailData } from '@/components/WfoTable/WfoAdvancedTable/getRowDetailData';
import {
  WfoTableControlColumnConfig,
  WfoTableControlColumnConfigItem,
  WfoTableDataColumnConfigItem,
} from '@/components/WfoTable/WfoTable';
import { useGetOrchestratorConfig, useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';
import { WfoGraphqlError } from '@/rtk';
import { Environment, RetrieverType } from '@/types';
import { getDefaultTableConfig } from '@/utils';

import { ColumnType, WfoTable, WfoTableProps } from '../WfoTable';
import { WfoFilterBuilder } from './WfoFilterBuilder';
import { WfoSearchFieldWithActions } from './WfoSearchFieldWithActions';
import { WfoSearchHelpModal } from './WfoSearchHelpModal';
import { WfoStructuredSearchTableOptionsMenu } from './WfoStructuredSearchTableOptionsMenu';
import { getWfoStructuredSearchTableStyles } from './styles';
import { toggleRowSelection, toggleSelectAll, useBuildColumnFilter } from './utils';

export type WfoStructuredSearchTableDataColumnConfigItem<
  T extends object,
  Property extends keyof T,
> = WfoTableDataColumnConfigItem<T, Property> & {
  renderDetails?: (cellValue: T[Property], row: T) => React.ReactNode;
  clipboardText?: (cellValue: T[Property], row: T) => string;
};
export type WfoStructuredSearchTableDataColumnConfig<T extends object> = {
  [Property in keyof T]: WfoStructuredSearchTableDataColumnConfigItem<T, Property> | WfoTableControlColumnConfigItem<T>;
};
export type WfoStructuredSearchTableColumnConfig<T extends object> = Partial<
  WfoTableControlColumnConfig<T> | WfoStructuredSearchTableDataColumnConfig<T>
>;
export type SearchParams = {
  queryString?: string | false;
  retrieverType?: RetrieverType;
  ruleGroup?: RuleGroupType | false;
  limit?: number;
  sortBy?: {
    field: string;
    sortOrder: string;
  };
};

export type WfoStructuredSearchTableBulkEditConfiguration<T extends object> = {
  uniqueRowId: keyof T;
};

export type WfoStructuredSearchTableProps<T extends object> = Omit<
  WfoTableProps<T>,
  'columnConfig' | 'onUpdateDataSearch'
> & {
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<T>;
  rowExpandingConfiguration: WfoTableProps<T>['rowExpandingConfiguration'];
  defaultHiddenColumns?: TableColumnKeys<T>;
  defaultAdvancedNestedSearch?: boolean;
  queryString?: string;
  localStorageKey: string;
  exportDataIsLoading?: boolean;
  error?: WfoGraphqlError[];
  onChangeQueryString: (queryString: string) => void;
  onSearchQueryString: (queryString: string) => void;
  onShowMore: () => void;
  onUpdateDataSorting: (updateSorting: WfoDataSorting<T>) => void;
  // Resolves a column key to its search field path (e.g. "status" -> "subscription.status"), used
  // when a column header search adds a condition to the filter query.
  getColumnSearchFieldName?: (field: keyof T) => string;
  onExportData?: () => void;
  retrieverType: RetrieverType;
  onUpdateRetrieverType: (newRetrieverType: RetrieverType) => void;
  filterString?: string;
  onUpdateFilterString: (filterString: string) => void;
  isValidFilterString?: boolean;
  queryBuilderRuleGroup?: RuleGroupType;
  onUpdateQueryBuilder: (ruleGroup: RuleGroupType | false) => void;
  handleSearch: (searchParams?: SearchParams) => void;
  pageSize: number;
  setPageSize: (updatedPageSize: number) => void;
  totalItems: number | false;
  hasNextPage: boolean;
  bulkEditConfiguration?: WfoStructuredSearchTableBulkEditConfiguration<T>;
};

export const WfoStructuredSearchTable = <T extends object>({
  tableColumnConfig,
  defaultHiddenColumns = [],
  defaultAdvancedNestedSearch = false,
  queryString,
  localStorageKey,
  exportDataIsLoading,
  error,
  onChangeQueryString,
  onSearchQueryString,
  onShowMore,
  onExportData,
  retrieverType,
  onUpdateRetrieverType,
  filterString,
  onUpdateFilterString,
  isValidFilterString,
  queryBuilderRuleGroup,
  onUpdateQueryBuilder,
  onUpdateDataSorting,
  getColumnSearchFieldName,
  handleSearch,
  pageSize,
  setPageSize,
  totalItems,
  rowExpandingConfiguration,
  dataSorting,
  hasNextPage,
  bulkEditConfiguration,
  data,
  isLoading,
  ...tableProps
}: WfoStructuredSearchTableProps<T>) => {
  const { theme } = useOrchestratorTheme();
  const { toggleButtonStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const { environmentName } = useGetOrchestratorConfig();
  const [hiddenColumns, setHiddenColumns] = useState<TableColumnKeys<T>>(defaultHiddenColumns);
  const [isFilterBuilderVisible, setIsFilterBuilderVisible] = useState(false);
  const [showTableSettingsModal, setShowTableSettingsModal] = useState(false);
  const [rowDetailModalData, setRowDetailModalData] = useState<T | undefined>(undefined);
  const [showInformationModal, setShowInformationModal] = useState(false);
  const [advancedNestedSearch, setAdvancedNestedSearch] = useState(defaultAdvancedNestedSearch);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const t = useTranslations('common');
  const { buildColumnFilter } = useBuildColumnFilter<T>(tableColumnConfig, getColumnSearchFieldName);

  useEffect(() => {
    if (defaultHiddenColumns) {
      setHiddenColumns(defaultHiddenColumns);
    }
  }, [defaultHiddenColumns]);

  useEffect(() => {
    setAdvancedNestedSearch(defaultAdvancedNestedSearch);
  }, [defaultAdvancedNestedSearch]);

  useEffect(() => {
    if (filterString) {
      setIsFilterBuilderVisible(true);
    }
  }, [filterString]);

  const detailsIconColumn: WfoStructuredSearchTableColumnConfig<T> = {
    viewDetails: {
      columnType: ColumnType.CONTROL,
      width: '36px',
      renderControl: (row) => (
        <EuiFlexItem css={{ cursor: 'pointer' }} onClick={() => setRowDetailModalData(row)}>
          <WfoArrowsExpand color={theme.colors.borderBasePlain} />
        </EuiFlexItem>
      ),
    },
  };

  const isBulkEditAvailable =
    !!bulkEditConfiguration && environmentName?.toLowerCase() === Environment.DEVELOPMENT.toLowerCase();

  const getRowId = (row: T) => String(bulkEditConfiguration ? row[bulkEditConfiguration.uniqueRowId] : '');

  const selectedRows = isBulkEditMode ? data.filter((row) => selectedRowIds.has(getRowId(row))) : [];
  const isAllSelected = data.length > 0 && selectedRows.length === data.length;

  const clearSelection = () => setSelectedRowIds(new Set());

  const handleToggleBulkEditMode = (enabled: boolean) => {
    setIsBulkEditMode(enabled);
    clearSelection();
  };

  const bulkEditSelectColumn: WfoStructuredSearchTableColumnConfig<T> = {
    bulkEditSelect: {
      columnType: ColumnType.CONTROL,
      width: '36px',
      renderControl: (row) => {
        const rowId = getRowId(row);
        return (
          <EuiCheckbox
            id={`bulk-edit-select-${rowId}`}
            checked={selectedRowIds.has(rowId)}
            onChange={() =>
              setSelectedRowIds((previousSelectedRowIds) => toggleRowSelection(previousSelectedRowIds, rowId))
            }
            aria-label={t('selectRow')}
          />
        );
      },
    },
  };

  const tableColumnsWithControlColumns: WfoStructuredSearchTableColumnConfig<T> =
    isBulkEditMode ?
      {
        ...bulkEditSelectColumn,
        ...Object.fromEntries(
          Object.entries(tableColumnConfig).filter(
            ([, columnConfig]) => columnConfig?.columnType !== ColumnType.CONTROL,
          ),
        ),
      }
    : {
        ...detailsIconColumn,
        ...tableColumnConfig,
      };

  const tableSettingsColumns = getTableSettingsColumns(tableColumnConfig, hiddenColumns);

  const rowDetailData: WfoKeyValueTableDataType[] | undefined =
    rowDetailModalData && getRowDetailData(rowDetailModalData, tableColumnConfig);

  const handleUpdateTableConfig = (updatedTableConfig: TableSettingsConfig<T>) => {
    const updatedHiddenColumns = updatedTableConfig.columns
      .filter((column) => !column.isVisible)
      .map((hiddenColumn) => hiddenColumn.field);
    setHiddenColumns(updatedHiddenColumns);
    setShowTableSettingsModal(false);
    setPageSize(updatedTableConfig.selectedPageSize);
    setTableConfigToLocalStorage(localStorageKey, {
      hiddenColumns: updatedHiddenColumns,
      selectedPageSize: updatedTableConfig.selectedPageSize,
      advancedNestedSearch,
    });
  };

  // The toggle applies live, so persist it immediately alongside the currently committed
  // hidden columns and page size instead of waiting for the modal's "Update" action.
  const handleToggleAdvancedNestedSearch = (checked: boolean) => {
    setAdvancedNestedSearch(checked);
    setTableConfigToLocalStorage(localStorageKey, {
      hiddenColumns,
      selectedPageSize: pageSize ?? DEFAULT_PAGE_SIZE,
      advancedNestedSearch: checked,
    });
  };

  const handleResetToDefaults = () => {
    const defaultTableConfig = getDefaultTableConfig<T>(localStorageKey);
    setHiddenColumns(defaultTableConfig.hiddenColumns);
    setPageSize(defaultTableConfig.selectedPageSize);
    setAdvancedNestedSearch(defaultTableConfig.advancedNestedSearch ?? false);
    setShowTableSettingsModal(false);
    clearTableConfigFromLocalStorage(localStorageKey);
  };

  const handleColumnFilterSearch = ({ field, searchText }: WfoDataSearch<T>) => {
    const columnFilter = buildColumnFilter(field, searchText, filterString);
    if (!columnFilter) {
      return;
    }
    onUpdateFilterString(columnFilter.filterString);
    handleSearch({ ruleGroup: columnFilter.ruleGroup });
  };

  return (
    <>
      <EuiFlexGroup alignItems="center" gutterSize="s">
        {!isFilterBuilderVisible && (
          <EuiFlexItem grow={false}>
            <EuiButton
              css={toggleButtonStyles}
              onClick={() => setIsFilterBuilderVisible(true)}
              id={'button-toggle-filter-builder'}
              data-test-id={'button-toggle-filter-builder'}
              fill
              type="submit"
              iconType="filter"
              iconSide="left"
              aria-label={t('createFilter')}
            >
              {t('createFilter')}
            </EuiButton>
          </EuiFlexItem>
        )}
        <WfoSearchFieldWithActions
          queryString={queryString}
          onChangeQueryString={onChangeQueryString}
          onSearchQueryString={onSearchQueryString}
          onShowInformation={() => setShowInformationModal(true)}
        />
        <EuiFlexItem grow={false}>
          <WfoStructuredSearchTableOptionsMenu
            onShowTableSettings={() => setShowTableSettingsModal(true)}
            advancedNestedSearch={advancedNestedSearch}
            onToggleAdvancedNestedSearch={handleToggleAdvancedNestedSearch}
            retrieverType={retrieverType}
            onUpdateRetrieverType={onUpdateRetrieverType}
            onExportData={onExportData}
            exportDataIsLoading={exportDataIsLoading}
            isBulkEditMode={isBulkEditMode}
            onToggleBulkEditMode={isBulkEditAvailable ? handleToggleBulkEditMode : undefined}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      {isFilterBuilderVisible && (
        <>
          <EuiSpacer size="s" />
          <WfoFilterBuilder
            filterString={filterString}
            onUpdateFilterString={onUpdateFilterString}
            isValidFilterString={isValidFilterString}
            queryBuilderRuleGroup={queryBuilderRuleGroup}
            onUpdateQueryBuilder={onUpdateQueryBuilder}
            handleSearch={handleSearch}
            onToggleFilterBuilder={setIsFilterBuilderVisible}
            useAdvancedNestedSearch={advancedNestedSearch}
            error={error}
          />
        </>
      )}

      {error && !isFilterBuilderVisible && <WfoErrorWithMessage error={error} />}

      {isBulkEditMode && isBulkEditAvailable && (
        <>
          <EuiSpacer size="m" />
          <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} wrap>
            <EuiFlexItem grow={false}>
              <EuiText size="s">{t('numberOfSelectedRows', { count: selectedRows.length })}</EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                size="s"
                onClick={() => setSelectedRowIds(toggleSelectAll(data.map(getRowId), isAllSelected))}
                iconType={isAllSelected ? 'cross' : 'grid'}
                isDisabled={data.length === 0}
              >
                {isAllSelected ? t('deselectAll') : t('selectAll')}
              </EuiButton>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty size="s" iconType="cross" onClick={() => handleToggleBulkEditMode(false)}>
                {t('exitBulkEditMode')}
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </>
      )}

      <EuiSpacer size="m" />

      <WfoTable<T>
        columnConfig={tableColumnsWithControlColumns}
        hiddenColumns={hiddenColumns}
        rowExpandingConfiguration={rowExpandingConfiguration}
        onUpdateDataSorting={onUpdateDataSorting}
        onUpdateDataSearch={handleColumnFilterSearch}
        dataSorting={dataSorting}
        data={data}
        isLoading={isLoading}
        loadingSkeletonRowCount={pageSize}
        {...tableProps}
      />

      {(totalItems || data.length > 0) && (
        <EuiFlexGroup alignItems={'center'} justifyContent={'center'} css={{ padding: theme.base }}>
          <EuiButton onClick={() => onShowMore()} disabled={!hasNextPage || isLoading}>
            {t('loadMore')}
          </EuiButton>
          <div>{totalItems ? `${data.length}/${totalItems} records` : `${data.length} records`}</div>
        </EuiFlexGroup>
      )}

      {showTableSettingsModal && (
        <TableSettingsModal
          tableConfig={{
            columns: tableSettingsColumns,
            selectedPageSize: pageSize ?? DEFAULT_PAGE_SIZE,
          }}
          pageSizeOptions={DEFAULT_PAGE_SIZES}
          onClose={() => setShowTableSettingsModal(false)}
          onUpdateTableConfig={handleUpdateTableConfig}
          onResetToDefaults={handleResetToDefaults}
        />
      )}

      {showInformationModal && <WfoSearchHelpModal onClose={() => setShowInformationModal(false)} />}

      {rowDetailData && (
        <WfoInformationModal title={'TODO: Information modal title'} onClose={() => setRowDetailModalData(undefined)}>
          <WfoKeyValueTable keyValues={rowDetailData} showCopyToClipboardIcon />
        </WfoInformationModal>
      )}
    </>
  );
};
