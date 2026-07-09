import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiSelect, EuiSpacer, EuiText } from '@elastic/eui';

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZES,
  TableColumnKeys,
  TableSettingsColumnConfig,
  TableSettingsConfig,
  TableSettingsModal,
  WfoDataSearch,
  WfoDataSorting,
  WfoErrorWithMessage,
  WfoInformationModal,
  WfoKeyValueTable,
  WfoKeyValueTableDataType,
  clearTableConfigFromLocalStorage,
  setTableConfigToLocalStorage,
} from '@/components';
import { getRowDetailData } from '@/components/WfoTable/WfoAdvancedTable/getRowDetailData';
import {
  WfoTableControlColumnConfig,
  WfoTableControlColumnConfigItem,
  WfoTableDataColumnConfigItem,
} from '@/components/WfoTable/WfoTable';
import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';
import { WfoGraphqlError } from '@/rtk';
import { FieldToOperatorMap, RetrieverType } from '@/types';
import { getDefaultTableConfig } from '@/utils';

import { ColumnType, WfoTable, WfoTableProps } from '../WfoTable';
import { WfoFilterBuilder } from './WfoFilterBuilder';
import { WfoSearchFieldWithActions } from './WfoSearchFieldWithActions';

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
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number | false;
  hasNextPage: boolean;
  prefilledFieldOptions: FieldToOperatorMap;
};

export const WfoStructuredSearchTable = <T extends object>({
  tableColumnConfig,
  defaultHiddenColumns = [],
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

  const [hiddenColumns, setHiddenColumns] = useState<TableColumnKeys<T>>(defaultHiddenColumns);
  const [isFilterBuilderVisible, setIsFilterBuilderVisible] = useState(false);
  const [showTableSettingsModal, setShowTableSettingsModal] = useState(false);
  const [rowDetailModalData, setRowDetailModalData] = useState<T | undefined>(undefined);
  const [showInformationModal, setShowInformationModal] = useState(false);
  const t = useTranslations('common');

  useEffect(() => {
    if (defaultHiddenColumns) {
      setHiddenColumns(defaultHiddenColumns);
    }
  }, [defaultHiddenColumns]);

  // Open the filter builder whenever a filter is present (e.g. arriving via a link with a filter in
  // the URL), so an active filter is always visible to the user.
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

  const tableSettingsColumns: TableSettingsColumnConfig<T>[] = Object.entries(tableColumnConfig).map(
    ([key, { label }]): TableSettingsColumnConfig<T> => {
      const field = key as keyof T;

      return {
        field,
        name: label,
        isVisible: hiddenColumns.indexOf(field) === -1,
      };
    },
  );

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
    });
  };

  const handleResetToDefaults = () => {
    const defaultTableConfig = getDefaultTableConfig<T>(localStorageKey);
    setHiddenColumns(defaultTableConfig.hiddenColumns);
    setPageSize(defaultTableConfig.selectedPageSize);
    setShowTableSettingsModal(false);
    clearTableConfigFromLocalStorage(localStorageKey);
  };

  const handleColumnFilterSearch = ({ field, searchText }: WfoDataSearch<T>) => {
    // parseCEL takes double-quoted string content literally, without any escape support, so a value
    // containing a double quote cannot be expressed as a CEL condition.
    if (!searchText || searchText.includes('"')) {
      return;
    }
    const searchFieldName = getColumnSearchFieldName?.(field) ?? String(field);
    const condition = `${searchFieldName} == "${searchText}"`;
    const currentFilter = filterString?.trim();
    // Parenthesize the existing filter: && binds tighter than || in CEL, so without parentheses the
    // new condition would attach to only the last OR branch of the existing filter.
    const newFilterString = currentFilter ? `(${currentFilter}) && ${condition}` : condition;

    // Only touch the filter draft and commit a search when the combined string parses to rules;
    // when it does not (e.g. the current draft is invalid CEL), leave the user's draft alone.
    let ruleGroup: RuleGroupType | undefined;
    try {
      ruleGroup = parseCEL(newFilterString);
    } catch {
      return;
    }
    if (!ruleGroup?.rules?.length) {
      return;
    }

    onUpdateFilterString(newFilterString);
    setIsFilterBuilderVisible(true);
    handleSearch({ ruleGroup });
  };

  const filterBuilder = (
    <WfoFilterBuilder
      filterString={filterString}
      onUpdateFilterString={onUpdateFilterString}
      isValidFilterString={isValidFilterString}
      queryBuilderRuleGroup={queryBuilderRuleGroup}
      onUpdateQueryBuilder={onUpdateQueryBuilder}
      handleSearch={handleSearch}
      isFilterBuilderVisible={isFilterBuilderVisible}
      onToggleFilterBuilder={setIsFilterBuilderVisible}
      prefilledFieldOptions={prefilledFieldOptions}
    />
  );

  return (
    <>
      <EuiFlexGroup alignItems="center" gutterSize="s">
        {!isFilterBuilderVisible && <EuiFlexItem grow={false}>{filterBuilder}</EuiFlexItem>}
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
          {filterBuilder}
        </>
      )}

      {error && <WfoErrorWithMessage error={error} />}

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
                    {t('export')}
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
