import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiSpacer } from '@elastic/eui';

import { TableColumnKeys, WfoTitleWithWebsocketBadge, addStatusFilterFromTab, removeTabStatusMatchingFields } from '@/components';
import {
  SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
  StoredTableConfig,
  SubscriptionSearchListItem,
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
import { getSearchPathToPropertyMap } from '@/components/WfoTable/WfoStructuredSearchTable/utils';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useStoredTableConfig } from '@/hooks';
import { useGetSubscriptionListSearchQuery } from '@/rtk';
import type { SubscriptionListSearchPayload, SubscriptionListSearchResponse } from '@/rtk/endpoints/subscriptionList';
import { buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import { EntityKind, SortOrder } from '@/types';
import { parseDate, parseDateToLocaleDateTimeString } from '@/utils';

const ALWAYS_REQUESTED_PROPERTIES: (keyof SubscriptionSearchListItem)[] = ['subscriptionId'];

const getItemsFromGraphqlResponse = (
  data: SubscriptionListSearchResponse,
  selectedTab: WfoSubscriptionListTab,
): SubscriptionSearchListItem[] =>
  data.searchEdges.map(
    ({ score, matchingFields, node }) =>
      ({
        ...node,
        'product.name': node.product?.name,
        'product.tag': node.product?.tag,
        'customer.fullname': node.customer?.fullname,
        'customer.shortcode': node.customer?.shortcode,
        startDate: parseDate(node.startDate),
        endDate: parseDate(node.endDate),
        score: {
          score,
          matchingFields: removeTabStatusMatchingFields(matchingFields, selectedTab, EntityKind.SUBSCRIPTION),
        },
      }) as SubscriptionSearchListItem,
  );

export const WfoSubscriptionsListPage = () => {
  const t = useTranslations('subscriptions.index');
  const tDetail = useTranslations('subscriptions.detail');
  const [activeTab, setActiveTab] = useQueryParam('activeTab', withDefault(StringParam, WfoSubscriptionListTab.ACTIVE));
  const selectedTab = subscriptionListTabs.find(({ id }) => id === activeTab)?.id ?? WfoSubscriptionListTab.ACTIVE;
  const getStoredTableConfig = useStoredTableConfig<SubscriptionSearchListItem>(SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SubscriptionSearchListItem>>();
  const {
    committedQueryString,
    committedFilterString,
    committedRuleGroup,
    retrieverType,
    dataSorting,
    pageSize,
    cursor,
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
    showNextPage,
  } = useStructuredSearchState<SubscriptionSearchListItem>({
    defaultSorting: { field: 'startDate', sortOrder: SortOrder.DESC },
    searchKeyScope: [selectedTab],
  });

  const tableColumnConfig: WfoStructuredSearchTableColumnConfig<SubscriptionSearchListItem> = {
    actions: {
      columnType: ColumnType.CONTROL,
      width: '50px',
      renderControl: (row) => <WfoSubscriptionActions compactMode={true} subscriptionId={row.subscriptionId} />,
    },
    subscriptionId: {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.subscription_id',
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
      searchPath: 'subscription.description',
      label: t('description'),
      width: '500px',
      renderData: (value, record) => <Link href={`/subscriptions/${record.subscriptionId}`}>{value}</Link>,
      renderTooltip: (value) => value,
    },
    status: {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.status',
      label: t('status'),
      width: '120px',
      renderData: (value) => <WfoSubscriptionStatusBadge status={value} />,
    },
    insync: {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.insync',
      label: t('insync'),
      width: '75px',
      isFilterable: 'toggle',
      renderData: (value) => <WfoInsyncIcon inSync={value} />,
    },
    'product.name': {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.product.name',
      width: '260px',
      label: t('product'),
    },
    'product.tag': {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.product.tag',
      label: t('tag'),
      width: '100px',
    },
    'customer.fullname': {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.customer_name',
      label: t('customerFullname'),
    },
    'customer.shortcode': {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.customer_abbreviation',
      label: t('customerShortcode'),
      width: '150px',
    },
    startDate: {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.start_date',
      label: t('startDate'),
      width: '100px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (cellValue) => cellValue?.toString(),
    },
    endDate: {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.end_date',
      label: t('endDate'),
      width: '100px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (cellValue) => cellValue?.toString(),
    },
    note: {
      columnType: ColumnType.DATA,
      searchPath: 'subscription.note',
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
      searchPath: 'subscription.metadata',
      label: t('metadata'),
      width: '100px',
      renderData: (value) => <WfoInlineJson data={value} />,
      renderDetails: (value) => value && <WfoJsonCodeBlock data={value} isBasicStyle />,
      renderTooltip: (value) => value && <WfoJsonCodeBlock data={value} isBasicStyle={false} />,
    },
  };

  const searchPathToProperty = getSearchPathToPropertyMap<SubscriptionSearchListItem>(tableColumnConfig);

  // The search payload is derived entirely from the committed search state, which lives in the URL
  // (queryString, filterString and activeTab params). Changing any of these values (whether via the UI or a
  // browser back/forward that updates the URL) produces a new payload and RTK Query re-runs the search.
  // RTK Query keys the request on the serialized payload, so it needs no memoization.
  const searchPayload: SubscriptionListSearchPayload = buildGraphqlSearchPayload<SubscriptionSearchListItem>({
    searchPathToProperty,
    alwaysRequestedProperties: ALWAYS_REQUESTED_PROPERTIES,
    hiddenColumns,
    dataSorting,
    query: committedQueryString,
    pageSize,
    retrieverType,
    filters: addStatusFilterFromTab(committedRuleGroup, selectedTab),
    cursor,
  });

  const { data, error, isFetching, endpointName } = useGetSubscriptionListSearchQuery(searchPayload);

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
      initPageSize(storedConfig.selectedPageSize);
    }
  }, [getStoredTableConfig, initPageSize]);

  // The columns that have a search path can be sorted and filtered
  const sortableAndFilterableFieldNames = [...searchPathToProperty.values()].map(String);
  const isSortingAllowed = queryString === '';
  const tableColumnConfigWithSortingAndFiltering =
    mapSortableAndFilterableValuesToTableColumnConfig<SubscriptionSearchListItem>(
      tableColumnConfig,
      isSortingAllowed ? sortableAndFilterableFieldNames : [],
      sortableAndFilterableFieldNames,
    );

  const subscriptionListItems = data && !isSearchBlocked ? getItemsFromGraphqlResponse(data, selectedTab) : [];

  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  const { exportData, isExporting } = useSearchExport<SubscriptionSearchListItem>({
    entityKind: EntityKind.SUBSCRIPTION,
    searchPathToProperty,
    tableColumnConfig,
    fileName: 'Subscriptions',
  });

  const onShowMore = () => {
    if (!isFetching) {
      showNextPage(nextPageCursor);
    }
  };

  const additionalHiddenColumns: TableColumnKeys<SubscriptionSearchListItem> =
    // only show 'score' when there is an active query or filter
    committedQueryString || committedFilterString ? [] : ['score'];

  // We manually show/hide the score column and shouldn't be configurable by the user.
  const nonEditableColumns: TableColumnKeys<SubscriptionSearchListItem> = ['score'];

  return (
    <>
      <WfoContentHeader title={<WfoTitleWithWebsocketBadge title={tDetail('title')} />} />

      <WfoFilterTabs
        tabs={subscriptionListTabs}
        selectedTab={selectedTab}
        translationNamespace="subscriptions.tabs"
        onChangeTab={setActiveTab}
      />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SubscriptionSearchListItem>
        entityKind={EntityKind.SUBSCRIPTION}
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
        onShowMore={onShowMore}
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
