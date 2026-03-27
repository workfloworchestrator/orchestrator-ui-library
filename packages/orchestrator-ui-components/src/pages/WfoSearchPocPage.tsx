import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { EuiSpacer } from '@elastic/eui';

import type { WfoDataSorting, WfoStructuredSearchTableDataColumnConfig } from '@/components';
import {
  DEFAULT_PAGE_SIZE,
  StoredTableConfig,
  WfoContentHeader,
  WfoDateTime,
  WfoFirstPartUUID,
  WfoInsyncIcon,
  WfoStructuredSearchTable,
  WfoSubscriptionStatusBadge,
  getDataSortHandler,
} from '@/components';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { DataDisplayParams, useDataDisplayParams, useStoredTableConfig } from '@/hooks';
import { SearchPayload, SearchResultResponse, useSearchMutation } from '@/rtk';
import { subscription_response_columns } from '@/rtk/endpoints/search';
import { Filter, RetrieverType, SortOrder } from '@/types';
import { getTypedFieldFromObject, parseDateToLocaleDateTimeString } from '@/utils';

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

export const WfoSearchPocPage = () => {
  const router = useRouter();
  // const t = useTranslations('search.page');
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
    // entity_id: {
    //   columnType: ColumnType.DATA,
    //   label: t('id'),
    //   width: '90px',
    //   renderData: (value) => <WfoFirstPartUUID UUID={value} />,
    //   renderDetails: (value) => value,
    //   renderTooltip: (value) => value,
    // },
    // entity_type: {
    //   columnType: ColumnType.DATA,
    //   label: t('type'),
    //   width: '90px',
    //   renderData: (value) => <div>{value}</div>,
    // },
    // entity_title: {
    //   columnType: ColumnType.DATA,
    //   label: t('title'),
    //   width: '450px',
    //   renderData: (value, record) => <Link href={`/subscriptions/${record.entity_id}`}>{value}</Link>,
    //   renderTooltip: (value) => value,
    // },
    // score: {
    //   columnType: ColumnType.DATA,
    //   label: t('score'),
    //   width: '90px',
    //   renderData: (value) => <div>{value}</div>,
    // },
    // matching_field: {
    //   columnType: ColumnType.DATA,
    //   label: t('matchingField'),
    //   width: '120px',
    //   renderData: (matchingField) => <div>{matchingField?.text}</div>,
    // },
    // perfect_match: {
    //   columnType: ColumnType.DATA,
    //   label: t('perfectMatch'),
    //   width: '120px',
    //   renderData: (perfectMatch) => <div>{perfectMatch}</div>,
    // },
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
      renderData: (cellValue, row) => {
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
      response_columns: query ? undefined : subscription_response_columns,
      limit: query ? undefined : dataDisplayParams.pageSize * (dataDisplayParams.pageIndex + 1),
      sort_by: dataDisplayParams.sortBy,
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
  const updateSorting = getDataSortHandler<SearchResultResponse>(setDataDisplayParam);

  const onUpdateQueryBuilder = (ruleGroup: RuleGroupType) => {
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

  return (
    <>
      <WfoContentHeader title="Search page POC" />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SearchResultResponse>
        data={data?.data || []}
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
    </>
  );
};
