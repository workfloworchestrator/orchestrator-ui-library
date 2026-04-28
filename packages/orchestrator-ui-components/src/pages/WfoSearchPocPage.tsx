import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiSpacer } from '@elastic/eui';

import {
  WfoDateTime,
  WfoInlineJson,
  WfoInsyncIcon,
  WfoJsonCodeBlock,
  WfoSubscriptionActions,
  WfoSubscriptionNoteEdit,
  WfoSubscriptionStatusBadge,
} from '@/components';
import type { SubscriptionListItem, WfoStructuredSearchTableColumnConfig } from '@/components';
import { StoredTableConfig, WfoContentHeader, WfoFirstPartUUID, WfoStructuredSearchTable } from '@/components';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { useStoredTableConfig } from '@/hooks';
import { SearchPayload, useSearchMutation } from '@/rtk';
import { Filter, RetrieverType, SearchResult } from '@/types';
import { parseDateToLocaleDateTimeString } from '@/utils';

import type {} from './subscriptions';

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

const getResponseColumnsFromTableConfig = <T extends object>(tableConfig: WfoStructuredSearchTableColumnConfig<T>) => {
  const responseColumns: string[] = [];
  Object.entries(tableConfig).map(([key, columnConfig]) => {
    if (columnConfig && columnConfig.columnType === ColumnType.DATA) {
      responseColumns.push(key);
    }
  });

  return responseColumns;
};

export const WfoSearchPocPage = () => {
  const t = useTranslations('search.page');
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto); // Part of the search endpoint payload that is passed as the retriever parameter

  // Part of the search endpoint payload that is passed in the q parameter
  const [queryText, setQueryText] = useState<string>();
  // String that is displayed in the filter textarea. This is transformed and if valid passed to the search endpoint in the filter parameter
  const [filterString, setFilterString] = useState<string>();
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType>();
  const [isValidFilterString, setIsValidFilterString] = useState<boolean>(true);

  const [triggerSearch, { isLoading, data }] = useSearchMutation();
  console.log('data', data);

  const getStoredTableConfig = useStoredTableConfig<SearchResult>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SearchResult>>();

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
    }
  }, [getStoredTableConfig]);

  const tableColumnConfig: WfoStructuredSearchTableColumnConfig<SubscriptionListItem> = {
    actions: {
      columnType: ColumnType.CONTROL,
      width: '50px',
      renderControl: (row) => <WfoSubscriptionActions compactMode={true} subscriptionId={row.subscriptionId} />,
    },
    subscriptionId: {
      columnType: ColumnType.DATA,
      label: t('id'),
      width: '100px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    description: {
      columnType: ColumnType.DATA,
      label: t('description'),
      width: '500px',
      renderData: (value, record) => <Link href={`/subscriptions/${record.subscriptionId}`}>{value}</Link>,
      renderTooltip: (value) => value,
    },
    status: {
      columnType: ColumnType.DATA,
      label: t('status'),
      width: '120px',
      renderData: (value) => <WfoSubscriptionStatusBadge status={value} />,
    },
    insync: {
      columnType: ColumnType.DATA,
      label: t('insync'),
      width: '75px',
      renderData: (value) => <WfoInsyncIcon inSync={value} />,
    },
    productName: {
      columnType: ColumnType.DATA,
      width: '260px',
      label: t('product'),
    },
    tag: {
      columnType: ColumnType.DATA,
      label: t('tag'),
      width: '100px',
    },
    customerFullname: {
      columnType: ColumnType.DATA,
      label: t('customerFullname'),
    },
    customerShortcode: {
      columnType: ColumnType.DATA,
      label: t('customerShortcode'),
      width: '150px',
    },
    startDate: {
      columnType: ColumnType.DATA,
      label: t('startDate'),
      width: '100px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (cellValue) => cellValue?.toString(),
    },
    endDate: {
      columnType: ColumnType.DATA,
      label: t('endDate'),
      width: '100px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (cellValue) => cellValue?.toString(),
    },
    note: {
      columnType: ColumnType.DATA,
      label: t('note'),
      width: '300px',
      renderData: (cellValue, row) => {
        return (
          <WfoSubscriptionNoteEdit
            onlyShowOnHover={true}
            endpointName={''}
            queryVariables={{}}
            subscriptionId={row.subscriptionId}
            note={cellValue}
          />
        );
      },
    },
    metadata: {
      columnType: ColumnType.DATA,
      label: t('metadata'),
      width: '100px',
      renderData: (value) => <WfoInlineJson data={value} />,
      renderDetails: (value) => value && <WfoJsonCodeBlock data={value} isBasicStyle />,
      renderTooltip: (value) => value && <WfoJsonCodeBlock data={value} isBasicStyle={false} />,
    },
  };

  const parseRuleGroupToFilters = (ruleGroup?: RuleGroupType) => {
    const elasticQuery = ruleGroup ? formatQuery(ruleGroup, { format: 'elasticsearch' }) : undefined;
    return elasticQuery as unknown as Filter;
  };

  const handleSearch = (searchParams?: {
    queryText?: string;
    retrieverType?: RetrieverType;
    ruleGroup?: RuleGroupType;
  }) => {
    const retriever = searchParams?.retrieverType || retrieverType;
    const query = searchParams?.queryText || queryText || '';
    const filters = parseRuleGroupToFilters(searchParams?.ruleGroup || queryBuilderRuleGroup);
    const requestColumns = getResponseColumnsFromTableConfig<SubscriptionListItem>(tableColumnConfig);
    console.log('requestColumns', requestColumns, tableColumnConfig);
    const searchPayload: SearchPayload = {
      query,
      entity_type: 'SUBSCRIPTION',
      response_columns: requestColumns,
      ...(retriever !== RetrieverType.Auto && { retriever }),
      ...(filters && { filters }),
    };
    triggerSearch(searchPayload);
  };

  const onUpdateQueryText = (queryText: string) => {
    setQueryText(queryText);
    handleSearch({ queryText });
  };

  const onUpdateRetrieverType = (retrieverType: RetrieverType) => {
    setRetrieverType(retrieverType);
    handleSearch({ retrieverType });
  };

  const onUpdateQueryBuilder = (ruleGroup: RuleGroupType) => {
    setQueryBuilderRuleGroup({ ...ruleGroup });
    const celQuery = formatQuery({ ...ruleGroup }, { format: 'cel' });
    setFilterString(celQuery);
  };

  const safeCelParse = (celString: string) => {
    try {
      const ruleGroup = parseCEL(celString);

      // parseCEL returns a query object — check if it has any rules

      if (ruleGroup.rules.length > 0) {
        setIsValidFilterString(true);
        setQueryBuilderRuleGroup(ruleGroup);
      } else {
        setIsValidFilterString(false);
      }
    } catch {
      setIsValidFilterString(false);
    }
  };

  const onUpdateFilterString = (filterString: string) => {
    setFilterString(filterString);
    safeCelParse(filterString);
  };

  return (
    <>
      <WfoContentHeader title="Search page POC" />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SubscriptionListItem>
        data={data?.data || []}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        filterString={filterString}
        handleSearch={handleSearch}
        isLoading={isLoading}
        isValidFilterString={isValidFilterString}
        localStorageKey={SEARCH_TABLE_LOCAL_STORAGE_KEY}
        onUpdateFilterString={onUpdateFilterString}
        onUpdateQueryBuilder={onUpdateQueryBuilder}
        onUpdateQueryText={onUpdateQueryText}
        onUpdateRetrieverType={onUpdateRetrieverType}
        queryBuilderRuleGroup={queryBuilderRuleGroup}
        queryText={queryText}
        retrieverType={retrieverType}
        tableColumnConfig={tableColumnConfig}
      />
    </>
  );
};
