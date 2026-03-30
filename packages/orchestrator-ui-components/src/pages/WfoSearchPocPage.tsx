import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { EuiButton, EuiSelect, EuiSpacer } from '@elastic/eui';

import type { WfoDataSorting, WfoStructuredSearchTableDataColumnConfig } from '@/components';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZES,
  StoredTableConfig,
  WfoContentHeader,
  WfoDateTime,
  WfoFirstPartUUID,
  WfoInsyncIcon,
  WfoStructuredSearchTable,
  WfoSubscriptionStatusBadge,
  getDataSortHandler,
} from '@/components';
import { ColumnType, WfoTable, WfoTableColumnConfig } from '@/components/WfoTable/WfoTable';
import { getWfoTableSettingsModalStyles } from '@/components/WfoTable/WfoTableSettingsModal/styles';
import { useDataDisplayParams, useStoredTableConfig, useWithOrchestratorTheme } from '@/hooks';
import { SearchPayload, SearchResultResponse, useSearchMutation } from '@/rtk';
import { subscription_response_columns } from '@/rtk/endpoints/search';
import { Filter, RetrieverType, SortOrder } from '@/types';
import { getTypedFieldFromObject, parseDateToLocaleDateTimeString } from '@/utils';

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

export type SurfSearchPocExpandData = {
  entity_id: string;
  entity_type: string;
  entity_title: string;
  score: number;
  matching_field: { text: string; path: string; highlight_indices: number[] };
  perfect_match: number;
};

export const SurfSearchPocExpandData = (data: SurfSearchPocExpandData) => {
  const t = useTranslations('search.page');

  const columnConfig: WfoTableColumnConfig<SurfSearchPocExpandData> = {
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

  return <WfoTable data={[data]} columnConfig={columnConfig} />;
};

export const WfoSearchPocPage = () => {
  const router = useRouter();
  const tableTranslations = useTranslations('subscriptions.index');
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto); // Part of the search endpoint payload that is passed as the retriever parameter

  // Part of the search endpoint payload that is passed in the q parameter
  const [queryText, setQueryText] = useState<string>();
  // String that is displayed in the filter textarea. This is transformed and if valid passed to the search endpoint in the filter parameter
  const [filterString, setFilterString] = useState<string>();
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType>();
  const [isValidFilterString, setIsValidFilterString] = useState<boolean>(true);

  const [triggerSearch, { isLoading, data }] = useSearchMutation();
  const getStoredTableConfig = useStoredTableConfig<SearchResultResponse>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SearchResultResponse>>();

  const [displayData, setDisplayData] = useState<NonNullable<typeof data>>({
    data: [],
    page_info: { has_next_page: false, next_page_cursor: null },
    search_metadata: { search_type: null, description: null },
  });
  const { dataDisplayParams, setDataDisplayParam } = useDataDisplayParams<SearchResultResponse>({
    pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
    sortBy: { field: 'startDate', order: SortOrder.DESC },
  });

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
    }
  }, [getStoredTableConfig]);

  const tableColumnConfig: WfoStructuredSearchTableDataColumnConfig<SearchResultResponse> = {
    subscriptionId: {
      columnType: ColumnType.DATA,
      label: tableTranslations('id'),
      width: '100px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    description: {
      columnType: ColumnType.DATA,
      label: tableTranslations('description'),
      width: '500px',
      renderData: (value, record) => <Link href={`/subscriptions/${record.subscriptionId}`}>{value}</Link>,
      renderTooltip: (value) => value,
    },
    status: {
      columnType: ColumnType.DATA,
      label: tableTranslations('status'),
      width: '120px',
      renderData: (value) => <WfoSubscriptionStatusBadge status={value} />,
    },
    insync: {
      columnType: ColumnType.DATA,
      label: tableTranslations('insync'),
      width: '80px',
      renderData: (value) => <WfoInsyncIcon inSync={value} />,
    },
    productName: {
      columnType: ColumnType.DATA,
      label: tableTranslations('product'),
    },
    tag: {
      columnType: ColumnType.DATA,
      label: tableTranslations('tag'),
      width: '100px',
    },
    customerName: {
      columnType: ColumnType.DATA,
      label: tableTranslations('customerFullname'),
    },
    customerShortcode: {
      columnType: ColumnType.DATA,
      label: tableTranslations('customerShortcode'),
      width: '150px',
    },
    startDate: {
      columnType: ColumnType.DATA,
      label: tableTranslations('startDate'),
      width: '120px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (cellValue) => cellValue?.toString(),
    },
    endDate: {
      columnType: ColumnType.DATA,
      label: tableTranslations('endDate'),
      width: '120px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (cellValue) => cellValue?.toString(),
    },
    note: {
      columnType: ColumnType.DATA,
      label: tableTranslations('note'),
      width: '300px',
      renderData: (cellValue) => {
        return <div>{cellValue}</div>;
      },
    },
  };

  const parseRuleGroupToFilters = (ruleGroup?: RuleGroupType) => {
    const elasticQuery = ruleGroup ? formatQuery(ruleGroup, { format: 'elasticsearch' }) : undefined;
    return elasticQuery as unknown as Filter;
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
      response_columns: subscription_response_columns,
      limit: query ? 10 : dataDisplayParams.pageSize * (dataDisplayParams.pageIndex + 1),
      sort_by: dataDisplayParams.sortBy,
    };
    triggerSearch(searchPayload);
  };

  const onUpdateRetrieverType = (retrieverType: RetrieverType) => {
    setDataDisplayParam('pageIndex', 0);
    setRetrieverType(retrieverType);
    search({ retrieverType });
  };

  const onUpdateQueryText = (queryText: string) => {
    setDataDisplayParam('pageIndex', 0);
    setQueryText(queryText);
    search({ queryText });
  };
  const updateSorting = getDataSortHandler<SearchResultResponse>(setDataDisplayParam);

  const onUpdateQueryBuilder = (ruleGroup: RuleGroupType) => {
    setDataDisplayParam('pageIndex', 0);
    search({ ruleGroup: ruleGroup });
    setQueryBuilderRuleGroup({ ...ruleGroup });
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

  useEffect(() => {
    if (data) setDisplayData(data);
  }, [data]);

  useEffect(() => {
    if (queryText || queryBuilderRuleGroup) search({});
  }, [JSON.stringify(dataDisplayParams)]);

  const sortedColumnId = getTypedFieldFromObject(dataDisplayParams?.sortBy.field, tableColumnConfig);
  if (!sortedColumnId) {
    router.replace('/search-poc');
    return null;
  }

  const dataSorting: WfoDataSorting<SearchResultResponse> = {
    field: sortedColumnId,
    sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
  };

  const tableColumnConfigWithSortable = Object.fromEntries(
    Object.entries(tableColumnConfig).map(([key, value]) => [key, { ...value, isSortable: true }]),
  );

  const options = DEFAULT_PAGE_SIZES.map((pageSizeOption) => ({
    value: pageSizeOption,
    text: pageSizeOption.toString(),
  }));

  const loadedItemsCount = dataDisplayParams.pageSize * (dataDisplayParams.pageIndex + 1);
  const totalItems = displayData.cursor?.total_items || 0;
  const showLoadedItemCount = loadedItemsCount < totalItems ? loadedItemsCount : totalItems;
  const { selectFieldStyle } = useWithOrchestratorTheme(getWfoTableSettingsModalStyles);

  const updatePage = () => {
    setDataDisplayParam('pageIndex', dataDisplayParams.pageIndex + 1);
  };
  const updatePageSize = (size: number) => {
    setDataDisplayParam('pageSize', size);
  };

  return (
    <>
      <WfoContentHeader title="Search page POC" />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SearchResultResponse>
        data={displayData.data}
        isLoading={isLoading}
        isValidFilterString={isValidFilterString}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        onUpdateQueryText={onUpdateQueryText}
        tableColumnConfig={tableColumnConfigWithSortable}
        localStorageKey={SEARCH_TABLE_LOCAL_STORAGE_KEY}
        queryText={queryText}
        retrieverType={retrieverType}
        onUpdateRetrieverType={onUpdateRetrieverType}
        queryBuilderRuleGroup={queryBuilderRuleGroup}
        onUpdateQueryBuilder={onUpdateQueryBuilder}
        filterString={filterString}
        onUpdateFilterString={onUpdateFilterString}
        dataSorting={[dataSorting]}
        onUpdateDataSorting={updateSorting}
      />
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <div style={{ width: '70px' }}>
          <EuiSelect
            css={selectFieldStyle}
            compressed
            onChange={(event) => updatePageSize(parseInt(event.target.value))}
            value={queryText ? 10 : dataDisplayParams.pageSize}
            options={options}
            disabled={!!queryText}
          />
        </div>
        <EuiButton onClick={updatePage} disabled={displayData.data.length === 0}>
          Load More
        </EuiButton>
        {totalItems ? ` ${showLoadedItemCount} / ${totalItems}` : ` ${showLoadedItemCount}`}
      </div>
    </>
  );
};
