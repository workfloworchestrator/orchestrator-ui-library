import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiSpacer } from '@elastic/eui';

import { SearchParams, addStatusFilterFromTab, removeTabStatusMatchingFields } from '@/components';
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
import { parseCelToRuleGroup } from '@/components/WfoTable/WfoStructuredSearchTable/utils';
import { ColumnType, WfoTableProps } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
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
  selectedTab: WfoSubscriptionListTab,
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
      (rowMap, { response_columns, score, perfect_match, matching_fields }) => {
        const idColumnInResponseColumn = getKeyByValueFromMap<T>(resultColumToPropertyMap, uniqueRowId);
        const rowId = response_columns[idColumnInResponseColumn];
        if (rowId) {
          rowMap[rowId] = (
            <WfoExpandingSearchRow
              score={score}
              matchingFields={removeTabStatusMatchingFields(matching_fields, selectedTab, EntityKind.SUBSCRIPTION)}
              perfectMatch={perfect_match}
            />
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
  // The committed query and filter live in the URL so a link reproduces the search and browser
  // back/forward re-runs it. The filter is stored as a CEL string and parsed back to a rule group.
  const [committedSearchQuery, setCommittedSearchQuery] = useQueryParam('queryString', withDefault(StringParam, ''));
  const [committedFilterString, setCommittedFilterString] = useQueryParam('filterString', withDefault(StringParam, ''));
  // Track the last value this page committed, so the URL->state sync effects below only rebuild the
  // inputs for external changes (page load, back/forward). Rebuilding on own commits would revert
  // characters typed right after committing (search bar) or visibly restructure builder rules the
  // CEL round trip cannot preserve, such as 'between'. The refs hold the value as the params decode
  // it (absent param -> ''); the setters receive undefined to remove an empty param from the URL.
  const lastSelfCommittedFilter = useRef('');
  const commitFilterString = (celString: string) => {
    lastSelfCommittedFilter.current = celString;
    setCommittedFilterString(celString || undefined);
  };
  const lastSelfCommittedQuery = useRef('');
  const commitSearchQuery = (queryText: string) => {
    lastSelfCommittedQuery.current = queryText;
    setCommittedSearchQuery(queryText || undefined);
  };

  // String that is displayed in the filter textarea. This is transformed and if valid passed to the search endpoint in the filter parameter
  const [filterString, setFilterString] = useState<string>('');
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType | undefined>();
  const committedRuleGroup = useMemo<RuleGroupType | undefined>(
    () => parseCelToRuleGroup(committedFilterString),
    [committedFilterString],
  );
  const [isValidFilterString, setIsValidFilterString] = useState<boolean>(true);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SubscriptionListItem>>();
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [pageCursor, setPageCursor] = useState<{ cursor: string; searchKey: string } | undefined>(undefined);
  const [dataSorting, setDataSorting] = useState<WfoDataSorting<SubscriptionListItem>>({
    field: 'subscriptionId',
    sortOrder: SortOrder.DESC,
  });

  // A next-page cursor is only valid for the committed search that produced it. Binding it to a key
  // of that search covers commits that bypass the handlers below, e.g. browser back/forward changing
  // the queryString/filterString/activeTab URL params: the key no longer matches, so the stale
  // cursor is not sent along with the new search.
  const committedSearchKey = JSON.stringify([
    committedSearchQuery,
    committedFilterString,
    selectedTab,
    retrieverType,
    dataSorting,
  ]);
  const cursor = pageCursor?.searchKey === committedSearchKey ? pageCursor.cursor : undefined;

  // The search payload is derived entirely from the committed search state, which lives in the URL
  // (queryString, filterString and activeTab params). Changing any of these values — whether via the
  // UI or a browser back/forward that updates the URL — produces a new payload and RTK Query re-runs
  // the search automatically. No imperative trigger or effect (and no eslint-disable) is needed.
  // Cursor is stripped from the RTK cache key, so a cursor change appends to the accumulated
  // result set instead of creating a new cache entry — see search endpoint's merge() logic.
  const searchPayload: SearchPayload = useMemo(() => {
    const filters = addStatusFilterFromTab(committedRuleGroup, selectedTab);
    const order_by = {
      element: getKeyByValueFromMap(resultColumToPropertyMap, dataSorting.field),
      direction: dataSorting.sortOrder.toLowerCase(),
    };
    return {
      query: committedSearchQuery,
      limit: pageSize,
      entity_type: EntityKind.SUBSCRIPTION,
      response_columns: Array.from(resultColumToPropertyMap.keys()),
      order_by,
      ...(retrieverType !== RetrieverType.Auto && { retriever: retrieverType }),
      ...(filters && { filters }),
      ...(cursor && { cursor }),
    };
  }, [committedSearchQuery, committedRuleGroup, selectedTab, retrieverType, pageSize, dataSorting, cursor]);

  const { data, isFetching } = useSearchQuery(searchPayload);

  const [getSubscriptionListTrigger] = useLazySearchQuery();
  const getSubscriptionListForExport = (exportLimit: number) =>
    getSubscriptionListTrigger({ ...searchPayload, limit: exportLimit, cursor: undefined }).unwrap();

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
      setPageSize(storedConfig.selectedPageSize);
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

  const sortableAndFilterableFieldNames = Object.keys(tableColumnConfig).filter((fieldName) => fieldName !== 'actions');
  const isSortingAllowed = queryText === '';
  const tableColumnConfigWithSortingAndFiltering =
    mapSortableAndFilterableValuesToTableColumnConfig<SubscriptionListItem>(
      tableColumnConfig,
      isSortingAllowed ? sortableAndFilterableFieldNames : [],
      sortableAndFilterableFieldNames,
    );

  const handleApplyFilter = (searchParams?: SearchParams) => {
    const ruleGroupParam = searchParams?.ruleGroup;
    // Use an explicitly passed rule group when provided (e.g. a column-header search), a cleared filter
    // when `false`, and otherwise the current query builder state (the "Apply filter" button).
    const effectiveRuleGroup = ruleGroupParam === false ? undefined : (ruleGroupParam ?? queryBuilderRuleGroup);
    // '' (no rule group, or only placeholder rules) commits an empty filter, clearing the URL param.
    const celQuery =
      effectiveRuleGroup ? formatQuery(effectiveRuleGroup, { format: 'cel', fallbackExpression: '' }) : '';
    // A non-empty CEL string must survive the round trip through the URL: formatQuery escapes double
    // quotes in values but parseCEL has no escape support, so such a filter would silently be dropped
    // after committing. Refuse the commit and flag the filter instead, keeping the URL and the search
    // results consistent.
    if (celQuery && !parseCelToRuleGroup(celQuery)) {
      setIsValidFilterString(false);
      return;
    }
    commitFilterString(celQuery);
    setPageCursor(undefined);
  };

  const onChangeQueryText = (queryText: string) => {
    setQueryText(queryText);
  };

  const onSearchQueryText = (queryText: string) => {
    setQueryText(queryText);
    commitSearchQuery(queryText);
    setPageCursor(undefined);
  };

  const onUpdateRetrieverType = (retrieverType: RetrieverType) => {
    setRetrieverType(retrieverType);
    setPageCursor(undefined);
  };

  const handleChangeTab = (updatedTab: WfoSubscriptionListTab) => {
    setActiveTab(updatedTab);
    setPageCursor(undefined);
  };

  const safeCelParse = useCallback((celString: string) => {
    if (celString === '') {
      setIsValidFilterString(true);
      return;
    }
    // parseCelToRuleGroup returns undefined when the string parses to no rules — in that
    // case we assume the string is not valid. In any case it would not do anything to the
    // search results. It also assigns the rule ids parseCEL leaves out, which the query
    // builder needs to keep rule identity stable across query updates.
    const ruleGroup = parseCelToRuleGroup(celString);
    if (ruleGroup) {
      setIsValidFilterString(true);
      setQueryBuilderRuleGroup(ruleGroup);
    } else {
      setIsValidFilterString(false);
    }
  }, []);

  // Populate the search bar and the filter builder from the URL, both on page load and when
  // back/forward navigation changes the committed search. Commits made by this page are skipped —
  // see the lastSelfCommitted refs above.
  useEffect(() => {
    if (committedSearchQuery === lastSelfCommittedQuery.current) {
      return;
    }
    lastSelfCommittedQuery.current = committedSearchQuery;
    setQueryText(committedSearchQuery);
  }, [committedSearchQuery]);

  useEffect(() => {
    if (committedFilterString === lastSelfCommittedFilter.current) {
      return;
    }
    lastSelfCommittedFilter.current = committedFilterString;
    setFilterString(committedFilterString);
    if (committedFilterString) {
      safeCelParse(committedFilterString);
    } else {
      setQueryBuilderRuleGroup(undefined);
      setIsValidFilterString(true);
    }
  }, [committedFilterString, safeCelParse]);

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
        // formatQuery output is normally valid CEL, but not unconditionally — a rule can
        // hold state formatQuery renders as unparseable CEL (e.g. a 'field' value source
        // renders its value unquoted). Validate the round trip so the invalid marker and
        // the Apply button track what the textarea actually shows.
        setIsValidFilterString(!!parseCelToRuleGroup(celQuery));
      }
    }
  };

  const onUpdateFilterString = (filterString: string) => {
    setFilterString(filterString);
    safeCelParse(filterString);
  };

  const { items: subscriptionListItems, rowExpandingConfiguration } =
    data ?
      getDataFromResponse<SubscriptionListItem>(data, resultColumToPropertyMap, 'subscriptionId', selectedTab)
    : { items: [] };

  const totalItems = getTotalItemsFromResponse(data);
  const hasNextPage = data?.page_info?.has_next_page ?? false;
  const nextPageCursor = data?.page_info?.next_page_cursor ?? undefined;

  const exportData = async () => {
    const exportResult = await getSubscriptionListForExport(totalItems || pageSize);
    const { items: exportItems } = getDataFromResponse<SubscriptionListItem>(
      exportResult,
      resultColumToPropertyMap,
      'subscriptionId',
      selectedTab,
    );
    if (!exportItems.length) {
      return;
    }
    initiateCsvFileDownload(exportItems, Object.keys(tableColumnConfig), getCsvFileNameWithDate('Subscriptions'));
  };

  const onShowMore = () => {
    if (!isFetching && nextPageCursor) {
      setPageCursor({ cursor: nextPageCursor, searchKey: committedSearchKey });
    }
  };

  const onUpdateDataSorting = ({ field, sortOrder }: WfoDataSorting<SubscriptionListItem>) => {
    setDataSorting({ field, sortOrder });
    setPageCursor(undefined);
  };

  const onUpdatePageSize = (updatedPageSize: number) => {
    if (updatedPageSize === pageSize) {
      return;
    }
    setPageSize(updatedPageSize);
    setPageCursor(undefined);
  };

  return (
    <>
      <WfoContentHeader title="Subscriptions (Beta)" />
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
        defaultShowMatchDetails={tableDefaults?.showMatchDetails}
        defaultAdvancedNestedSearch={tableDefaults?.advancedNestedSearch}
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
        tableColumnConfig={tableColumnConfigWithSortingAndFiltering}
        getColumnSearchFieldName={(field) => getKeyByValueFromMap(resultColumToPropertyMap, field)}
        pageSize={pageSize}
        onUpdateDataSorting={onUpdateDataSorting}
        setPageSize={onUpdatePageSize}
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        prefilledFieldOptions={prefilledFieldOptions}
        onExportData={exportData}
      />
    </>
  );
};
