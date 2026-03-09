import React, { useEffect, useState } from 'react';

// import { QueryBuilder } from 'react-querybuilder';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiSpacer } from '@elastic/eui';

import { StoredTableConfig, WfoContentHeader, WfoFirstPartUUID, WfoStructuredSearchTable } from '@/components';
import type { WfoStructuredSearchTableDataColumnConfig } from '@/components';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { useStoredTableConfig } from '@/hooks';
import { SearchPayload } from '@/rtk';
import { useSearchMutation } from '@/rtk';
import { SearchResult } from '@/types';

/*
entity_id: string;
entity_type: EntityKind;
entity_title: string;
score: number;
perfect_match: number;
matching_field?: MatchingField | null;
*/

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

export const WfoSearchPocPage = () => {
  const t = useTranslations('search.page');
  const [triggerSearch, { isLoading, data }] = useSearchMutation();
  const getStoredTableConfig = useStoredTableConfig<SearchResult>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SearchResult>>();

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
    }
  }, [getStoredTableConfig]);

  const onSearch = (queryText: string) => {
    const searchPayload: SearchPayload = {
      query: queryText,
      entity_type: 'SUBSCRIPTION',
    };
    triggerSearch(searchPayload);
  };

  const tableColumnConfig: WfoStructuredSearchTableDataColumnConfig<SearchResult> = {
    entity_id: {
      columnType: ColumnType.DATA,
      label: t('id'),
      width: '90px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    entity_type: {
      columnType: ColumnType.DATA,
      label: t('type'),
      width: '90px',
      renderData: (value) => <div>{value}</div>,
    },
    entity_title: {
      columnType: ColumnType.DATA,
      label: t('title'),
      width: '450px',
      renderData: (value, record) => <Link href={`/subscriptions/${record.entity_id}`}>{value}</Link>,
      renderTooltip: (value) => value,
    },
    score: {
      columnType: ColumnType.DATA,
      label: t('score'),
      width: '90px',
      renderData: (value) => <div>{value}</div>,
    },
    matching_field: {
      columnType: ColumnType.DATA,
      label: t('matchingField'),
      width: '120px',
      renderData: (matchingField) => <div>{matchingField?.text}</div>,
    },
    perfect_match: {
      columnType: ColumnType.DATA,
      label: t('perfectMatch'),
      width: '120px',
      renderData: (perfectMatch) => <div>{perfectMatch}</div>,
    },
  };

  return (
    <>
      <WfoContentHeader title="Search page POC" />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SearchResult>
        data={data?.data || []}
        isLoading={isLoading}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        onUpdateQueryString={(queryText) => {
          onSearch(queryText);
        }}
        tableColumnConfig={tableColumnConfig}
        localStorageKey={SEARCH_TABLE_LOCAL_STORAGE_KEY}
      />
    </>
  );
};

/*
*
* export type WfoTableProps<T extends object> = {
  data: T[];
   // Ommited in parent type columnConfig: WfoTableColumnConfig<T>;
  hiddenColumns?: TableColumnKeys<T>;
  columnOrder?: TableColumnKeys<T>;
  isLoading?: boolean;
  dataSorting?: WfoDataSorting<T>[];
  rowExpandingConfiguration?: {
    uniqueRowId: keyof WfoTableColumnConfig<T>;
    uniqueRowIdToExpandedRowMap: Record<string, ReactNode>;
  };
  pagination?: Pagination;
  overrideHeader?: (
    tableHeaderEntries: Array<[string, WfoTableControlColumnConfigItem<T> | WfoTableDataColumnConfigItem<T, keyof T>]>,
  ) => ReactNode;
  onRowClick?: (row: T) => void;
  onUpdateDataSorting?: (updatedDataSorting: WfoDataSorting<T>) => void;
  onUpdateDataSearch?: (updatedDataSearch: WfoDataSearch<T>) => void;
  appendFillerColumn?: boolean;
  className?: string;
  isVirtualized?: boolean;
  height?: number;
};
*
*   tableColumnConfig: WfoStructuredSearchTableColumnConfig<T>;
  defaultHiddenColumns?: TableColumnKeys<T>;
  queryString?: string;
  localStorageKey: string;
  detailModal?: boolean;
  detailModalTitle?: string;
  exportDataIsLoading?: boolean;
  error?: WfoGraphqlError[];
  onUpdateQueryString: (queryString: string) => void;
  onExportData?: () => void;
*
*
*
* */
