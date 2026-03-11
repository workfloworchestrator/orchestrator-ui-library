import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiSpacer } from '@elastic/eui';

import type { WfoStructuredSearchTableDataColumnConfig } from '@/components';
import { StoredTableConfig, WfoContentHeader, WfoFirstPartUUID, WfoStructuredSearchTable } from '@/components';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { useStoredTableConfig } from '@/hooks';
import { SearchPayload, useSearchMutation } from '@/rtk';
import { Filter, RetrieverType, SearchResult } from '@/types';

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

export const WfoSearchPocPage = () => {
  const t = useTranslations('search.page');
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto);
  const [queryText, setQueryText] = useState<string>();
  const [filter, setFilter] = useState<Filter>();
  const [triggerSearch, { isLoading, data }] = useSearchMutation();
  const getStoredTableConfig = useStoredTableConfig<SearchResult>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SearchResult>>();

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
    }
  }, [getStoredTableConfig]);

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

  const search = (searchParams: { queryText?: string; retrieverType?: RetrieverType; filters?: Filter }) => {
    const retriever = searchParams.retrieverType || retrieverType;
    const query = searchParams.queryText || queryText || '';
    const filters = searchParams.filters;
    const searchPayload: SearchPayload = {
      query,
      entity_type: 'SUBSCRIPTION',
      ...(retriever !== RetrieverType.Auto && { retriever }),
      ...(filters && { filters }),
    };
    triggerSearch(searchPayload);
  };

  const onUpdateRetrieverType = (retrieverType: RetrieverType) => {
    setRetrieverType(retrieverType);
    search({ retrieverType });
  };

  const onUpdateQueryText = (queryText: string) => {
    setQueryText(queryText);
    search({ queryText });
  };

  const onUpdateFilter = (filter: Filter) => {
    setFilter(filter);
    search({ filters: filter });
  };

  return (
    <>
      <WfoContentHeader title="Search page POC" />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SearchResult>
        data={data?.data || []}
        isLoading={isLoading}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        onUpdateQueryText={onUpdateQueryText}
        tableColumnConfig={tableColumnConfig}
        localStorageKey={SEARCH_TABLE_LOCAL_STORAGE_KEY}
        queryText={queryText}
        retrieverType={retrieverType}
        onUpdateRetrieverType={onUpdateRetrieverType}
        filter={filter}
        onUpdateFilter={onUpdateFilter}
      />
    </>
  );
};
