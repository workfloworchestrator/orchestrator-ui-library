import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiCheckbox } from '@elastic/eui';

import { useGetOrchestratorConfig } from '@/hooks';
import { Environment } from '@/types';

import { ColumnType } from '../WfoTable';
import type {
  WfoStructuredSearchTableBulkEditConfiguration,
  WfoStructuredSearchTableColumnConfig,
} from './WfoStructuredSearchTable';
import { toggleRowSelection, toggleSelectAll } from './utils';

export type useBulkEditProps<T extends object = object> = {
  isBulkEditAvailable: boolean;
  isBulkEditMode: boolean;
  selectedRows: T[];
  isAllSelected: boolean;
  canSelectAll: boolean;
  handleToggleBulkEditMode: (enabled: boolean) => void;
  handleToggleSelectAll: () => void;
  withBulkEditColumns: (
    columnConfig: WfoStructuredSearchTableColumnConfig<T>,
  ) => WfoStructuredSearchTableColumnConfig<T>;
};

// Bulk edit is only available on Development, for tables that provide a bulkEditConfiguration. Rows are
// identified by the stringified value of uniqueRowId; toggling the mode always starts from an empty selection.
export const useBulkEdit = <T extends object>(
  data: T[],
  bulkEditConfiguration?: WfoStructuredSearchTableBulkEditConfiguration<T>,
): useBulkEditProps<T> => {
  const t = useTranslations('common');
  const { environmentName } = useGetOrchestratorConfig();
  const [isBulkEditModeEnabled, setIsBulkEditModeEnabled] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const isBulkEditAvailable =
    !!bulkEditConfiguration && environmentName?.toLowerCase() === Environment.DEVELOPMENT.toLowerCase();
  const isBulkEditMode = isBulkEditAvailable && isBulkEditModeEnabled;

  const getRowId = (row: T) => String(bulkEditConfiguration ? row[bulkEditConfiguration.uniqueRowId] : '');

  const selectedRows = isBulkEditMode ? data.filter((row) => selectedRowIds.has(getRowId(row))) : [];
  const isAllSelected = data.length > 0 && selectedRows.length === data.length;

  const handleToggleBulkEditMode = (enabled: boolean) => {
    setIsBulkEditModeEnabled(enabled);
    setSelectedRowIds(new Set());
  };

  const handleToggleSelectAll = () => setSelectedRowIds(toggleSelectAll(data.map(getRowId), isAllSelected));

  const selectColumn: WfoStructuredSearchTableColumnConfig<T> = {
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

  // In bulk edit mode the select column replaces all control columns (e.g. view details, actions).
  const withBulkEditColumns = (
    columnConfig: WfoStructuredSearchTableColumnConfig<T>,
  ): WfoStructuredSearchTableColumnConfig<T> =>
    isBulkEditMode ?
      {
        ...selectColumn,
        ...Object.fromEntries(
          Object.entries(columnConfig).filter(([, column]) => column?.columnType !== ColumnType.CONTROL),
        ),
      }
    : columnConfig;

  return {
    isBulkEditAvailable,
    isBulkEditMode,
    selectedRows,
    isAllSelected,
    canSelectAll: data.length > 0,
    handleToggleBulkEditMode,
    handleToggleSelectAll,
    withBulkEditColumns,
  };
};
