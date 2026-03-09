import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

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
import {
  WfoTableControlColumnConfig,
  WfoTableControlColumnConfigItem,
  WfoTableDataColumnConfigItem,
} from '@/components/WfoTable/WfoTable';
import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';
import { WfoGraphqlError } from '@/rtk';
import { getDefaultTableConfig } from '@/utils';

import { ColumnType, WfoTable, WfoTableProps } from '../WfoTable';
import { updateQueryString } from '../WfoTableWithFilter/updateQueryString';

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

export type WfoStructuredSearchTableProps<T extends object> = Omit<
  WfoTableProps<T>,
  'columnConfig' | 'onUpdateDataSearch'
> & {
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<T>;
  defaultHiddenColumns?: TableColumnKeys<T>;
  queryString?: string;
  localStorageKey: string;
  exportDataIsLoading?: boolean;
  error?: WfoGraphqlError[];
  onUpdateQueryString: (queryString: string) => void;
  onExportData?: () => void;
};

export const WfoStructuredSearchTable = <T extends object>({
  tableColumnConfig,
  defaultHiddenColumns = [],
  queryString,
  localStorageKey,
  exportDataIsLoading,
  error,
  onUpdateQueryString,
  onExportData,
  ...tableProps
}: WfoStructuredSearchTableProps<T>) => {
  const { theme } = useOrchestratorTheme();

  const [hiddenColumns, setHiddenColumns] = useState<TableColumnKeys<T>>(defaultHiddenColumns);
  const [showTableSettingsModal, setShowTableSettingsModal] = useState(false);
  const [rowDetailModalData, setRowDetailModalData] = useState<T | undefined>(undefined);
  const [showInformationModal, setShowInformationModal] = useState(false);
  const t = useTranslations('common');

  useEffect(() => {
    if (defaultHiddenColumns) {
      setHiddenColumns(defaultHiddenColumns);
    }
  }, [defaultHiddenColumns]);

  const { pagination } = tableProps;

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
    setShowTableSettingsModal(false);
    clearTableConfigFromLocalStorage(localStorageKey);
    pagination?.onChangeItemsPerPage?.(defaultTableConfig.selectedPageSize ?? DEFAULT_PAGE_SIZE);
    pagination?.onChangePage?.(0);
  };

  return (
    <>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem>
          <WfoSearchField queryString={queryString} onUpdateQueryString={onUpdateQueryString} />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            onClick={() => setShowInformationModal(true)}
            iconSize={'l'}
            iconType={'info'}
            aria-label={t('searchModalTitle')}
          />
        </EuiFlexItem>
        <EuiButton onClick={() => setShowTableSettingsModal(true)}>{t('editColumns')}</EuiButton>
        {onExportData && (
          <EuiButton isLoading={exportDataIsLoading} onClick={() => onExportData()}>
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
          onUpdateQueryString(updateQueryString(queryString ?? '', field.toString(), searchText))
        }
        {...tableProps}
      />

      {showTableSettingsModal && (
        <TableSettingsModal
          tableConfig={{
            columns: tableSettingsColumns,
            selectedPageSize: pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
          }}
          pageSizeOptions={pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZES}
          onClose={() => setShowTableSettingsModal(false)}
          onUpdateTableConfig={handleUpdateTableConfig}
          onResetToDefaults={handleResetToDefaults}
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
