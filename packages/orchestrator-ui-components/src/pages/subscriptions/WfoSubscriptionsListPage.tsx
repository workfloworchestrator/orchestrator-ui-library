import React, { useEffect, useState } from 'react';

import { get } from 'lodash';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiSpacer } from '@elastic/eui';

import {
  TableColumnKeys,
  WfoTitleWithWebsocketBadge,
  addStatusFilterFromTab,
  removeTabStatusMatchingFields,
} from '@/components';
import {
  SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
  StoredTableConfig,
  SubscriptionListItem,
  WfoContentHeader,
  WfoDateTime,
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
  subscriptionListTabs,
  useSearchExport,
  useStructuredSearchState,
} from '@/components';
import { WfoConfidenceScore } from '@/components/WfoSubscription/WfoConfidenceScore';
import { WfoMatchingFields } from '@/components/WfoSubscription/WfoMatchingFields';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useStoredTableConfig } from '@/hooks';
import { useGetSubscriptionListSearchQuery } from '@/rtk';
import { getGraphqlField } from '@/rtk/endpoints/subscriptionList';
import type { SubscriptionListSearchPayload, SubscriptionListSearchResponse } from '@/rtk/endpoints/subscriptionList';
import { buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import { EntityKind, ResultColumToPropertyMap, SortOrder } from '@/types';
import { parseDate, parseDateToLocaleDateTimeString } from '@/utils';

const ALWAYS_REQUESTED_PROPERTIES: (keyof SubscriptionListItem)[] = ['subscriptionId'];

const searchPathToProperty: ResultColumToPropertyMap<SubscriptionListItem> = new Map([
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

// Fills each list item property from the GraphQL field of its column. Columns the user hid are not
// requested, so they are absent from the node and stay undefined (as in the REST response).
const getItemsFromGraphqlResponse = (
  data: SubscriptionListSearchResponse,
  selectedTab: WfoSubscriptionListTab,
): SubscriptionListItem[] =>
  data.searchEdges.map(({ score, matchingFields, node }) => {
    const edge = Object.fromEntries(
      [...searchPathToProperty].map(([searchPath, property]) => [property, get(node, getGraphqlField(searchPath))]),
    );

    const metadata = edge.metadata && Object.keys(edge.metadata).length > 0 ? edge.metadata : null;
    return {
      ...edge,
      startDate: parseDate(edge.startDate),
      endDate: parseDate(edge.endDate),
      metadata,
      score: {
        score,
        matchingFields: removeTabStatusMatchingFields(matchingFields, selectedTab, EntityKind.SUBSCRIPTION),
      },
    } as SubscriptionListItem;
  });

export const WfoSubscriptionsListPage = () => {
  const t = useTranslations('subscriptions.index');
  const tDetail = useTranslations('subscriptions.detail');
  const [activeTab, setActiveTab] = useQueryParam('activeTab', withDefault(StringParam, WfoSubscriptionListTab.ACTIVE));
  const selectedTab = subscriptionListTabs.find(({ id }) => id === activeTab)?.id ?? WfoSubscriptionListTab.ACTIVE;
  const getStoredTableConfig = useStoredTableConfig<SubscriptionListItem>(SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SubscriptionListItem>>();
  const {
    committedQueryString,
    committedFilterString,
    committedRuleGroup,
    retrieverType,
    dataSorting,
    pageSize,
    cursor,
    pageIndex,
    loadedPageCount,
    isTextSearch,
    isSearchBlocked,
    queryString,
    filterString,
    queryBuilderRuleGroup,
    isValidFilterString,
    hiddenColumns,
    setHiddenColumns,
    initPageSize,
    onChangeQueryString,
    onSearchQueryString,
    handleApplyFilter,
    onUpdateRetrieverType,
    onUpdateQueryBuilder,
    onUpdateFilterString,
    onUpdateDataSorting,
    onUpdatePageSize,
    resetPageCursor,
    showPage,
    showNextPage,
  } = useStructuredSearchState<SubscriptionListItem>({
    defaultSorting: { field: 'startDate', sortOrder: SortOrder.DESC },
    searchKeyScope: [selectedTab],
  });

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
    score: {
      columnType: ColumnType.DATA,
      label: t('score'),
      width: '100px',
      excludeFromDetails: true,
      renderData: (value) => (
        <WfoConfidenceScore
          score={value?.score}
          fullyConfident={committedFilterString !== '' && committedQueryString === ''}
        />
      ),
      renderTooltip: (value) => <WfoMatchingFields matchingFields={value?.matchingFields} />,
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
      isFilterable: 'toggle',
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
            endpointName={endpointName}
            queryVariables={searchPayload}
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

  // The search payload is derived entirely from the committed search state, which lives in the URL
  // (queryString, filterString and activeTab params). Changing any of these values (whether via the UI or a
  // browser back/forward that updates the URL) produces a new payload and RTK Query re-runs the search.
  // RTK Query keys the request on the serialized payload, so it needs no memoization.
  const searchPayload: SubscriptionListSearchPayload = buildGraphqlSearchPayload<SubscriptionListItem>({
    searchPathToProperty,
    alwaysRequestedProperties: ALWAYS_REQUESTED_PROPERTIES,
    hiddenColumns,
    dataSorting,
    query: committedQueryString,
    pageSize,
    retrieverType,
    filters: addStatusFilterFromTab(committedRuleGroup, selectedTab),
    cursor,
    offset: isTextSearch ? undefined : pageIndex * pageSize,
  });

  const { data, error, isFetching, endpointName } = useGetSubscriptionListSearchQuery(searchPayload);

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
      initPageSize(storedConfig.selectedPageSize);
    }
  }, [getStoredTableConfig, initPageSize]);

  const sortableAndFilterableFieldNames = Object.keys(tableColumnConfig).filter(
    (fieldName) => fieldName !== 'actions' && fieldName !== 'score',
  );
  const isSortingAllowed = queryString === '';
  const tableColumnConfigWithSortingAndFiltering =
    mapSortableAndFilterableValuesToTableColumnConfig<SubscriptionListItem>(
      tableColumnConfig,
      isSortingAllowed ? sortableAndFilterableFieldNames : [],
      sortableAndFilterableFieldNames,
    );

  const handleChangeTab = (updatedTab: WfoSubscriptionListTab) => {
    setActiveTab(updatedTab);
    resetPageCursor();
  };

  const subscriptionListItems = data && !isSearchBlocked ? getItemsFromGraphqlResponse(data, selectedTab) : [];

  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  const { exportData, isExporting } = useSearchExport<SubscriptionListItem>({
    entityKind: EntityKind.SUBSCRIPTION,
    searchPathToProperty,
    tableColumnConfig,
    fileName: 'Subscriptions',
  });

  const onShowNextPage = () => {
    if (!isFetching) {
      showNextPage(nextPageCursor);
    }
  };

  const additionalHiddenColumns: TableColumnKeys<SubscriptionListItem> =
    // only show 'score' when there is an active query or filter
    committedQueryString || committedFilterString ? [] : ['score'];

  // We manually show/hide the score column and shouldn't be configurable by the user.
  const nonEditableColumns: TableColumnKeys<SubscriptionListItem> = ['score'];

  return (
    <>
      <WfoContentHeader title={<WfoTitleWithWebsocketBadge title={tDetail('title')} />} />

      <WfoFilterTabs
        tabs={subscriptionListTabs}
        selectedTab={selectedTab}
        translationNamespace="subscriptions.tabs"
        onChangeTab={handleChangeTab}
      />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SubscriptionListItem>
        data={subscriptionListItems}
        error={mapRtkErrorToWfoError(error)}
        rowExpandingConfiguration={undefined}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        additionalHiddenColumns={additionalHiddenColumns}
        onHiddenColumnsChange={setHiddenColumns}
        nonEditableColumns={nonEditableColumns}
        defaultAdvancedNestedSearch={tableDefaults?.advancedNestedSearch}
        filterString={filterString}
        handleSearch={handleApplyFilter}
        isLoading={isFetching}
        dataSorting={[dataSorting]}
        isValidFilterString={isValidFilterString}
        localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
        onUpdateFilterString={onUpdateFilterString}
        onUpdateQueryBuilder={onUpdateQueryBuilder}
        onChangeQueryString={onChangeQueryString}
        onSearchQueryString={onSearchQueryString}
        pageIndex={pageIndex}
        onChangePage={showPage}
        onShowNextPage={onShowNextPage}
        isTextSearch={isTextSearch}
        loadedPageCount={loadedPageCount}
        onUpdateRetrieverType={onUpdateRetrieverType}
        queryBuilderRuleGroup={queryBuilderRuleGroup}
        queryString={queryString}
        retrieverType={retrieverType}
        tableColumnConfig={tableColumnConfigWithSortingAndFiltering}
        getColumnSearchFieldName={(field) => getSearchPath(searchPathToProperty, field)}
        pageSize={pageSize}
        onUpdateDataSorting={onUpdateDataSorting}
        setPageSize={onUpdatePageSize}
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        onExportData={() => exportData(searchPayload)}
        bulkEditConfiguration={{ uniqueRowId: 'subscriptionId' }}
        exportDataIsLoading={isExporting}
      />
    </>
  );
};
