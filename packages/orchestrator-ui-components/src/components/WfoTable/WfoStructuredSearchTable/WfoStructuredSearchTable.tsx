import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
} from '@elastic/eui';

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
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';
import { WfoGraphqlError } from '@/rtk';
import { FieldToOperatorMap, RetrieverType } from '@/types';
import { getDefaultTableConfig } from '@/utils';

import { ColumnType, WfoTable, WfoTableProps } from '../WfoTable';
import { WfoFilterBuilder } from './WfoFilterBuilder';
import { WfoSearchFieldWithActions } from './WfoSearchFieldWithActions';
import { getWfoStructuredSearchTableStyles } from './styles';
import { buildColumnFilter } from './utils';

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
  queryText?: string | false;
  retrieverType?: RetrieverType;
  ruleGroup?: RuleGroupType | false;
  limit?: number;
  sortBy?: {
    field: string;
    sortOrder: string;
  };
};

export type WfoStructuredSearchTableProps<T extends object> = Omit<
  WfoTableProps<T>,
  'columnConfig' | 'onUpdateDataSearch'
> & {
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<T>;
  rowExpandingConfiguration: WfoTableProps<T>['rowExpandingConfiguration'];
  defaultHiddenColumns?: TableColumnKeys<T>;
  defaultShowMatchDetails?: boolean;
  queryText?: string;
  localStorageKey: string;
  exportDataIsLoading?: boolean;
  error?: WfoGraphqlError[];
  onChangeQueryText: (queryString: string) => void;
  onSearchQueryText: (queryString: string) => void;
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
  prefilledFieldOptions: FieldToOperatorMap;
};

export const WfoStructuredSearchTable = <T extends object>({
  tableColumnConfig,
  defaultHiddenColumns = [],
  defaultShowMatchDetails = false,
  queryText,
  localStorageKey,
  exportDataIsLoading,
  error,
  onChangeQueryText,
  onSearchQueryText,
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
  data,
  isLoading,
  prefilledFieldOptions,
  ...tableProps
}: WfoStructuredSearchTableProps<T>) => {
  const { theme } = useOrchestratorTheme();
  const { toggleButtonStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const [hiddenColumns, setHiddenColumns] = useState<TableColumnKeys<T>>(defaultHiddenColumns);
  const [isFilterBuilderVisible, setIsFilterBuilderVisible] = useState(false);
  const [showTableSettingsModal, setShowTableSettingsModal] = useState(false);
  const [rowDetailModalData, setRowDetailModalData] = useState<T | undefined>(undefined);
  const [showInformationModal, setShowInformationModal] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(defaultShowMatchDetails);
  const t = useTranslations('common');

  useEffect(() => {
    if (defaultHiddenColumns) {
      setHiddenColumns(defaultHiddenColumns);
    }
  }, [defaultHiddenColumns]);

  useEffect(() => {
    setShowMatchDetails(defaultShowMatchDetails);
  }, [defaultShowMatchDetails]);

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

  const tableColumnsWithControlColumns: WfoStructuredSearchTableColumnConfig<T> = {
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
      showMatchDetails,
    });
  };

  // The toggle applies live, so persist it immediately alongside the currently committed
  // hidden columns and page size instead of waiting for the modal's "Update" action.
  const handleToggleShowMatchDetails = (checked: boolean) => {
    setShowMatchDetails(checked);
    setTableConfigToLocalStorage(localStorageKey, {
      hiddenColumns,
      selectedPageSize: pageSize ?? DEFAULT_PAGE_SIZE,
      showMatchDetails: checked,
    });
  };

  const handleResetToDefaults = () => {
    const defaultTableConfig = getDefaultTableConfig<T>(localStorageKey);
    setHiddenColumns(defaultTableConfig.hiddenColumns);
    setPageSize(defaultTableConfig.selectedPageSize);
    setShowMatchDetails(defaultTableConfig.showMatchDetails ?? false);
    setShowTableSettingsModal(false);
    clearTableConfigFromLocalStorage(localStorageKey);
  };

  const handleColumnFilterSearch = ({ field, searchText }: WfoDataSearch<T>) => {
    const columnFilter = buildColumnFilter(field, searchText, filterString, getColumnSearchFieldName);
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
          queryText={queryText}
          onChangeQueryText={onChangeQueryText}
          onSearchQueryText={onSearchQueryText}
          onShowInformation={() => setShowInformationModal(true)}
          onShowTableSettings={() => setShowTableSettingsModal(true)}
        />
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
            prefilledFieldOptions={prefilledFieldOptions}
          />
        </>
      )}

      {error && <WfoErrorWithMessage error={error} />}

      <EuiSpacer size="m" />

      <WfoTable<T>
        columnConfig={tableColumnsWithControlColumns}
        hiddenColumns={hiddenColumns}
        rowExpandingConfiguration={rowExpandingConfiguration}
        showExpandedRows={showMatchDetails}
        onUpdateDataSorting={onUpdateDataSorting}
        onUpdateDataSearch={handleColumnFilterSearch}
        dataSorting={dataSorting}
        data={data}
        isLoading={isLoading}
        {...tableProps}
      />

      {totalItems && (
        <EuiFlexGroup alignItems={'center'} justifyContent={'center'} css={{ padding: theme.base }}>
          <EuiButton onClick={() => onShowMore()} disabled={!hasNextPage || isLoading}>
            {t('loadMore')}
          </EuiButton>
          <div>{`${data.length}/${totalItems} records`}</div>
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
          extraSettings={
            <>
              <EuiFormRow label={t('showMatchDetails')} display="columnCompressed">
                <EuiSwitch
                  showLabel={false}
                  label={t('showMatchDetails')}
                  checked={showMatchDetails}
                  onChange={(event) => handleToggleShowMatchDetails(event.target.checked)}
                  compressed
                />
              </EuiFormRow>
              <EuiFormRow label={t('retrieval')} display="columnCompressed">
                <EuiSelect
                  options={[
                    { value: RetrieverType.Auto, text: t('retrieverAuto') },
                    { value: RetrieverType.Fuzzy, text: t('retrieverFuzzy') },
                    { value: RetrieverType.Semantic, text: t('retrieverSemantic') },
                    { value: RetrieverType.Hybrid, text: t('retrieverHybrid') },
                  ]}
                  value={retrieverType}
                  onChange={(e) => onUpdateRetrieverType(e.target.value as RetrieverType)}
                  compressed
                />
              </EuiFormRow>
              {onExportData && (
                <>
                  <EuiSpacer size="m" />
                  <EuiButton isLoading={exportDataIsLoading} onClick={() => onExportData()} fullWidth>
                    {totalItems ? t('exportRows', { numberOfRows: totalItems }) : t('export')}
                  </EuiButton>
                </>
              )}
            </>
          }
        />
      )}

      {showInformationModal && (
        <WfoInformationModal title={t('searchModalTitle')} onClose={() => setShowInformationModal(false)}>
          <EuiText>
            <p>TODO: Info about searching</p>
          </EuiText>
        </WfoInformationModal>
      )}

      {rowDetailData && (
        <WfoInformationModal title={'TODO: Information modal title'} onClose={() => setRowDetailModalData(undefined)}>
          <WfoKeyValueTable keyValues={rowDetailData} showCopyToClipboardIcon />
        </WfoInformationModal>
      )}
    </>
  );
};
