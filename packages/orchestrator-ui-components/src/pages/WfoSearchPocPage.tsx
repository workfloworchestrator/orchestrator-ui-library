import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiSpacer } from '@elastic/eui';

import { SearchParams, combineSearchFilters } from '@/components';
import {
  DEFAULT_PAGE_SIZE,
  StoredTableConfig,
  SubscriptionListItem,
  WfoContentHeader,
  WfoDataSorting,
  WfoDateTime,
  WfoExpandingSearchRow,
  WfoFilterTabs,
  WfoFirstPartUUID,
  WfoInlineJson,
  WfoInsyncIcon,
  WfoJsonCodeBlock,
  WfoStructuredSearchTable,
  WfoStructuredSearchTableColumnConfig,
  WfoSubscriptionActions,
  WfoSubscriptionListTab,
  WfoSubscriptionNoteEdit,
  WfoSubscriptionStatusBadge,
  WfoTableColumnConfig,
  subscriptionListTabs,
} from '@/components';
import { ColumnType, WfoTableProps } from '@/components/WfoTable/WfoTable';
import { useStoredTableConfig } from '@/hooks';
import { SearchPayload, useLazySearchQuery, useSearchQuery } from '@/rtk';
import {
  EntityKind,
  FieldToOperatorMap,
  PaginatedSearchResults,
  ResultColumToPropertyMap,
  RetrieverType,
  SortOrder,
} from '@/types';
import { getCsvFileNameWithDate, initiateCsvFileDownload, parseDateToLocaleDateTimeString } from '@/utils';

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

const getKeyByValueFromMap = <T,>(resultColumToPropertyMap: ResultColumToPropertyMap<T>, field: keyof T) => {
  return [...resultColumToPropertyMap.entries()].find(([, v]) => v === field)?.[0] || '';
};

const getDataFromResponse = <T extends object>(
  data: PaginatedSearchResults,
  resultColumToPropertyMap: ResultColumToPropertyMap<T>,
  uniqueRowId: keyof T,
): {
  items: T[];
  rowExpandingConfiguration?: WfoTableProps<T>['rowExpandingConfiguration'];
} => {
  const searchResult = data?.data;
  if (!searchResult)
    return {
      items: [],
    };

  const responseColumns: Record<string, string | number | null>[] =
    searchResult.map(({ response_columns }) => response_columns) || [];

  const rowExpandingConfiguration: WfoTableProps<T>['rowExpandingConfiguration'] = {
    uniqueRowId: uniqueRowId as keyof WfoTableColumnConfig<T>,
    uniqueRowIdToExpandedRowMap: searchResult.reduce(
      (rowMap, { response_columns, score, perfect_match, matching_field }) => {
        const idColumnInResponseColumn = getKeyByValueFromMap<T>(resultColumToPropertyMap, uniqueRowId);
        const rowId = response_columns[idColumnInResponseColumn];
        if (rowId) {
          rowMap[rowId] = (
            <WfoExpandingSearchRow score={score} matchingField={matching_field} perfectMatch={perfect_match} />
          );
        }
        return rowMap;
      },
      {} as Record<string, ReactNode>,
    ),
  };

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

  return {
    items,
    rowExpandingConfiguration,
  };
};

const getTotalItemsFromResponse = (data: PaginatedSearchResults | undefined): number | false => {
  return data?.cursor?.total_items || false;
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

/* These options will be added as the first options in the field dropdown in the FieldSelector */
const prefilledFieldOptions: FieldToOperatorMap = new Map([
  ['subscription.subscription_id', ['eq', 'neq', 'like']],
  ['subscription.description', ['eq', 'neq', 'like']],
  ['subscription.status', ['eq', 'neq', 'like']],
  ['subscription.insync', ['eq', 'neq']],
  ['subscription.product.name', ['eq', 'neq', 'like']],
  ['subscription.product.tag', ['eq', 'neq', 'like']],
  ['subscription.customer_name', ['eq', 'neq', 'like']],
  ['subscription.customer_abbreviation', ['eq', 'neq', 'like']],
  ['subscription.start_date', ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'between']],
  ['subscription.end_date', ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'between']],
  ['subscription.note', ['eq', 'neq', 'like']],
]);

export const WfoSearchPocPage = () => {
  const t = useTranslations('subscriptions.index');
  const [activeTab, setActiveTab] = useQueryParam('activeTab', withDefault(StringParam, WfoSubscriptionListTab.ACTIVE));
  const selectedTab = subscriptionListTabs.find(({ id }) => id === activeTab)?.id ?? WfoSubscriptionListTab.ACTIVE;
  const getStoredTableConfig = useStoredTableConfig<SubscriptionListItem>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto);

  // Part of the search endpoint payload that is passed in the q parameter
  const [queryText, setQueryText] = useState<string>('');
  const [committedSearchQuery, setCommittedSearchQuery] = useState<string>('');

  // String that is displayed in the filter textarea. This is transformed and if valid passed to the search endpoint in the filter parameter
  const [filterString, setFilterString] = useState<string>();
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType | undefined>();
  const [committedRuleGroup, setCommittedRuleGroup] = useState<RuleGroupType | undefined>();
  const [isValidFilterString, setIsValidFilterString] = useState<boolean>(true);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SubscriptionListItem>>();
  const [pageSize, setPageSize] = useState<number>(tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE);
  const [limit, setLimit] = useState<number>(pageSize);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [dataSorting, setDataSorting] = useState<WfoDataSorting<SubscriptionListItem>>({
    field: 'subscriptionId',
    sortOrder: SortOrder.DESC,
  });

  // The search payload is derived entirely from the committed search state. Changing any of these
  // values — including the active tab, whether via a tab click or a browser back/forward that
  // updates the activeTab URL param — produces a new payload and RTK Query re-runs the search
  // automatically. No imperative trigger or effect (and no eslint-disable) is needed.
  // Cursor is stripped from the RTK cache key, so a cursor change appends to the accumulated
  // result set instead of creating a new cache entry — see search endpoint's merge() logic.
  const searchPayload: SearchPayload = useMemo(() => {
    const filters = combineSearchFilters(committedRuleGroup, selectedTab);
    const order_by = {
      element: getKeyByValueFromMap(resultColumToPropertyMap, dataSorting.field),
      direction: dataSorting.sortOrder.toLowerCase(),
    };
    return {
      query: committedSearchQuery,
      limit,
      entity_type: EntityKind.SUBSCRIPTION,
      response_columns: Array.from(resultColumToPropertyMap.keys()),
      order_by,
      ...(retrieverType !== RetrieverType.Auto && { retriever: retrieverType }),
      ...(filters && { filters }),
      ...(cursor && { cursor }),
    };
  }, [committedSearchQuery, committedRuleGroup, selectedTab, retrieverType, limit, dataSorting, cursor]);

  const { data, isFetching } = useSearchQuery(searchPayload);

  const [getSubscriptionListTrigger] = useLazySearchQuery();
  const getSubscriptionListForExport = () => getSubscriptionListTrigger(searchPayload).unwrap();

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
      isSortable: true,
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

  const handleApplyFilter = (searchParams?: SearchParams) => {
    setCommittedRuleGroup(searchParams?.ruleGroup === false ? undefined : queryBuilderRuleGroup);
    setCursor(undefined);
  };

  const onChangeQueryText = (queryText: string) => {
    setQueryText(queryText);
  };

  const onSearchQueryText = (queryText: string) => {
    setQueryText(queryText);
    setCommittedSearchQuery(queryText);
    setCursor(undefined);
  };

  const onUpdateRetrieverType = (retrieverType: RetrieverType) => {
    setRetrieverType(retrieverType);
    setCursor(undefined);
  };

  const handleChangeTab = (updatedTab: WfoSubscriptionListTab) => {
    setActiveTab(updatedTab);
    setLimit(pageSize);
    setCursor(undefined);
  };

  const safeCelParse = (celString: string) => {
    try {
      const ruleGroup = parseCEL(celString);
      if (celString === '') {
        setIsValidFilterString(true);
      } else if (ruleGroup?.rules?.length > 0) {
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

  const { items: subscriptionListItems, rowExpandingConfiguration } =
    data ? getDataFromResponse<SubscriptionListItem>(data, resultColumToPropertyMap, 'subscriptionId') : { items: [] };

  const totalItems = getTotalItemsFromResponse(data);
  const hasNextPage = data?.page_info?.has_next_page ?? false;
  const nextPageCursor = data?.page_info?.next_page_cursor ?? undefined;

  const exportData = async () => {
    const exportResult = await getSubscriptionListForExport();
    const { items: exportItems } = getDataFromResponse<SubscriptionListItem>(
      exportResult,
      resultColumToPropertyMap,
      'subscriptionId',
    );
    if (!exportItems.length) {
      return;
    }
    initiateCsvFileDownload(exportItems, Object.keys(tableColumnConfig), getCsvFileNameWithDate('Subscriptions'));
  };

  const onShowMore = () => {
    if (!isFetching && nextPageCursor) {
      setCursor(nextPageCursor);
    }
  };

  const onUpdateDataSorting = ({ field, sortOrder }: WfoDataSorting<SubscriptionListItem>) => {
    setDataSorting({ field, sortOrder });
    setLimit(pageSize);
    setCursor(undefined);
  };

  return (
    <>
      <WfoContentHeader title="Subscriptions (POC)" />
      <WfoFilterTabs
        tabs={subscriptionListTabs}
        selectedTab={selectedTab}
        translationNamespace="subscriptions.tabs"
        onChangeTab={handleChangeTab}
      />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SubscriptionListItem>
        data={subscriptionListItems}
        rowExpandingConfiguration={rowExpandingConfiguration}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        filterString={filterString}
        handleSearch={handleApplyFilter}
        isLoading={isFetching}
        dataSorting={[dataSorting]}
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
        pageSize={pageSize}
        onUpdateDataSorting={onUpdateDataSorting}
        setPageSize={setPageSize}
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        prefilledFieldOptions={prefilledFieldOptions}
        onExportData={exportData}
      />
    </>
  );
};
