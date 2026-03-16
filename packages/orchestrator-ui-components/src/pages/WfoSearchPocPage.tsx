import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';

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
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto); // Part of the search endpoint payload that is passed as the retriever parameter

  // Part of the search endpoint payload that is passed in the q parameter
  const [queryText, setQueryText] = useState<string>();
  // String that is displayed in the filter textarea. This is transformed and if valid passed to the search endpoint in the filter parameter
  const [filterString, setFilterString] = useState<string>();
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType>();

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

  const parseRuleGroupToFilters = (ruleGroup?: RuleGroupType) => {
    return ruleGroup as unknown as Filter;
  };

  const search = (searchParams: { queryText?: string; retrieverType?: RetrieverType; ruleGroup?: RuleGroupType }) => {
    const retriever = searchParams.retrieverType || retrieverType;
    const query = searchParams.queryText || queryText || '';
    const filters = parseRuleGroupToFilters(searchParams.ruleGroup || queryBuilderRuleGroup);

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

  const onUpdateQueryBuilder = (ruleGroup: RuleGroupType) => {
    setQueryBuilderRuleGroup({ ...ruleGroup });
    const celQuery = formatQuery({ ...ruleGroup }, { format: 'cel' });
    setFilterString(celQuery);
  };

  const onUpdateFilterString = (filterString: string) => {
    setFilterString(filterString);
    const ruleGroup: RuleGroupType = parseCEL(filterString);
    setQueryBuilderRuleGroup(ruleGroup);
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
        queryBuilderRuleGroup={queryBuilderRuleGroup}
        onUpdateQueryBuilder={onUpdateQueryBuilder}
        filterString={filterString}
        onUpdateFilterString={onUpdateFilterString}
      />
    </>
  );
};
