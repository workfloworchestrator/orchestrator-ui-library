import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { EuiSpacer } from '@elastic/eui';

import type { SubscriptionListItem, WfoStructuredSearchTableColumnConfig } from '@/components';
import { StoredTableConfig, WfoContentHeader, WfoDateTime, WfoFirstPartUUID, WfoInlineJson, WfoInsyncIcon, WfoJsonCodeBlock, WfoStructuredSearchTable, WfoSubscriptionActions, WfoSubscriptionNoteEdit, WfoSubscriptionStatusBadge } from '@/components';
import type { SearchParams } from '@/components';
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
  ['subscription.product.tag', 'tag'],
  ['subscription.customer_name', 'customerFullname'],
  ['subscription.customer_abbreviation', 'customerShortcode'],
  ['subscription.start_date', 'startDate'],
  ['subscription.end_date', 'endDate'],
  ['subscription.note', 'note'],
  ['subscription.metadata', 'metadata'],
]);

export const WfoSearchPocPage = () => {
  const t = useTranslations('subscriptions.index');
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto); // Part of the search endpoint payload that is passed as the retriever parameter

  // Part of the search endpoint payload that is passed in the q parameter
  const [queryText, setQueryText] = useState<string>('');
  // String that is displayed in the filter textarea. This is transformed and if valid passed to the search endpoint in the filter parameter
  const [filterString, setFilterString] = useState<string>();
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType | undefined>();
  const [isValidFilterString, setIsValidFilterString] = useState<boolean>(true);

  const [triggerSearch, { isLoading, data }] = useSearchMutation();

  const getStoredTableConfig = useStoredTableConfig<SubscriptionListItem>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SubscriptionListItem>>();
  const [limit, setLimit] = useState<number>(tableDefaults?.selectedPageSize || 10);

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
    }
  }, [getStoredTableConfig]);

  useEffect(() => {
    if (!isLoading && !data) {
      handleSearch();
    }
  },[]);

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
    const elasticQuery =
      ruleGroup ? formatQuery(ruleGroup, { format: 'elasticsearch', fallbackExpression: '' }) : undefined;
    return elasticQuery as unknown as Filter;
  };

  const getFilters = (query: string, ruleGroup: RuleGroupType | false | undefined) => {
    if(ruleGroup === false ) return false;

    if (!query && !ruleGroup) {
      return parseRuleGroupToFilters(parseCEL(`status=="active"`));
    }
    return parseRuleGroupToFilters(ruleGroup);
  }

  const handleSearch = (searchParams?: SearchParams) => {
    const retriever = searchParams?.retrieverType || retrieverType;
    const query = searchParams?.queryText || queryText || '';

    // If there is no query and no ruleGroup selected we default to something that gives results
    const ruleGroup = searchParams?.ruleGroup === false ? false : searchParams?.ruleGroup || queryBuilderRuleGroup;
    const filters = getFilters(query, ruleGroup);

    const queryLimit: number = searchParams?.limit || limit;
    const searchPayload: SearchPayload = {
      query,
      limit: queryLimit,
      entity_type: EntityKind.SUBSCRIPTION,
      response_columns: Array.from(resultColumToPropertyMap.keys()),
      ...(retriever !== RetrieverType.Auto && { retriever }),
      ...(filters && { filters }),
    };

    triggerSearch(searchPayload);
  };;

  const onChangeQueryText = (queryText: string) => {
    setQueryText(queryText);
  };

  const onSearchQueryText = (queryText: string) => {
    setQueryText(queryText);
    handleSearch({ queryText });
  };

  const onUpdateRetrieverType = (retrieverType: RetrieverType) => {
    setRetrieverType(retrieverType);
    handleSearch({ retrieverType });
  };

  const safeCelParse = (celString: string) => {
    try {
      const ruleGroup = parseCEL(celString);
      if (celString === '') {
        setIsValidFilterString(true);
      } else if (ruleGroup.rules.length > 0) {
        // parseCEL returns a query object — check if it has any rules
        setIsValidFilterString(true);
        setQueryBuilderRuleGroup(ruleGroup);
      } else {
        // If there are no rules created based on this string then
        // we assume the string is not valid. In any case it will not do anything
        // to the search results
        setIsValidFilterString(false);
      }
    } catch {
      setIsValidFilterString(false);
    }
  };

  const onUpdateQueryBuilder = (ruleGroup: RuleGroupType | false) => {
    if (ruleGroup === false) {
      setQueryBuilderRuleGroup(undefined);
      setFilterString('');
      setIsValidFilterString(true);
    } else {
      setQueryBuilderRuleGroup({ ...ruleGroup });
      const celQuery = formatQuery({ ...ruleGroup }, { format: 'cel', fallbackExpression: '' });
      // 1 == 1 indicates the query can't be parsed. This is a fallback to allow it to still be used as
      // part of other queries.
      if (!celQuery || celQuery === '1 == 1') {
        setFilterString('');
        setIsValidFilterString(true);
      } else {
        setFilterString(celQuery);
        setIsValidFilterString(true);
      }
    }
  };

  const onUpdateFilterString = (filterString: string) => {
    setFilterString(filterString);
    safeCelParse(filterString);
  };

  const subscriptionListItems: SubscriptionListItem[] =
    data ? getDataFromResponse<SubscriptionListItem>(data, resultColumToPropertyMap) : [];

  const onShowMore = () => {
    setLimit((limit) => {
      const newLimit = limit + 10
      handleSearch({limit: newLimit});
      return newLimit
    })
  }

  return (
    <>
      <WfoContentHeader title="Subscriptions (POC)" />
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
        onChangeQueryText={onChangeQueryText}
        onSearchQueryText={onSearchQueryText}
        onShowMore={onShowMore}
        onUpdateRetrieverType={onUpdateRetrieverType}

        queryBuilderRuleGroup={queryBuilderRuleGroup}
        queryText={queryText}
        retrieverType={retrieverType}
        tableColumnConfig={tableColumnConfig}
      />
    </>
  );
};
