import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiSpacer } from '@elastic/eui';

import type { SubscriptionListItem, WfoStructuredSearchTableColumnConfig } from '@/components';
import {
  StoredTableConfig,
  WfoContentHeader,
  WfoDateTime,
  WfoFirstPartUUID,
  WfoInlineJson,
  WfoInsyncIcon,
  WfoJsonCodeBlock,
  WfoStructuredSearchTable,
  WfoSubscriptionActions,
  WfoSubscriptionNoteEdit,
  WfoSubscriptionStatusBadge,
} from '@/components';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { useStoredTableConfig } from '@/hooks';
import { SearchPayload, useSearchMutation } from '@/rtk';
import { EntityKind, Filter, PaginatedSearchResults, RetrieverType } from '@/types';
import { parseDateToLocaleDateTimeString } from '@/utils';

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

type ResultColumToPropertyMap<T> = Map<string, keyof T>;

const getDataFromResponse = <T,>(
  data: PaginatedSearchResults,
  resultColumToPropertyMap: ResultColumToPropertyMap<T>,
) => {
  const responseColumns: Record<string, string | number | null>[] =
    data?.data?.map(({ response_columns }) => response_columns) || [];

  const items: T[] = responseColumns.map((responseColumn) => {
    const item = Object.entries(responseColumn).reduce((acc, [key, value]) => {
      const itemKey = resultColumToPropertyMap.get(key);
      if (itemKey) {
        acc[itemKey] = value as unknown as T[keyof T];
      }
      return acc;
    }, {} as T);
    return item;
  });

  return items;
};

const resultColumToPropertyMap: ResultColumToPropertyMap<SubscriptionListItem> = new Map([
  ['subscription.subscription_id', 'subscriptionId'],
  ['subscription.description', 'description'],
  ['subscription.status', 'status'],
  ['subscription.insync', 'insync'],
  ['subscription.product.name', 'productName'],
  ['subscription.tag', 'tag'],
  ['subscription.customer.fullname', 'customerFullname'],
  ['subscription.customer.shortcode', 'customerShortcode'],
  ['subscription.start_date', 'startDate'],
  ['subscription.end_date', 'endDate'],
  ['subscription.note', 'note'],
  ['subscription.metadata', 'metadata'],
]);

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

  const getStoredTableConfig = useStoredTableConfig<SubscriptionListItem>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SubscriptionListItem>>();

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

    const searchPayload: SearchPayload = {
      query,
      entity_type: EntityKind.SUBSCRIPTION,
      response_columns: Array.from(resultColumToPropertyMap.keys()),
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

  const subscriptionListItems: SubscriptionListItem[] =
    data ? getDataFromResponse<SubscriptionListItem>(data, resultColumToPropertyMap) : [];
  return (
    <>
      <WfoContentHeader title="Search page POC" />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SubscriptionListItem>
        data={subscriptionListItems}
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
