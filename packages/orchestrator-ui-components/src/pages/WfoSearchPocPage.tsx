import React, { ReactNode, useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiSpacer } from '@elastic/eui';

import type { SearchParams } from '@/components';
import {
  DEFAULT_PAGE_SIZE,
  StoredTableConfig,
  SubscriptionListItem,
  WfoContentHeader,
  WfoDataSorting,
  WfoDateTime,
  WfoExpandingSearchRow,
  WfoFirstPartUUID,
  WfoInlineJson,
  WfoInsyncIcon,
  WfoJsonCodeBlock,
  WfoStructuredSearchTable,
  WfoStructuredSearchTableColumnConfig,
  WfoSubscriptionActions,
  WfoSubscriptionNoteEdit,
  WfoSubscriptionStatusBadge,
} from '@/components';
import { ColumnType, WfoTableProps } from '@/components/WfoTable/WfoTable';
import { useStoredTableConfig } from '@/hooks';
import { SearchPayload, useSearchMutation } from '@/rtk';
import {
  EntityKind,
  FieldToOperatorMap,
  Filter,
  PaginatedSearchResults,
  ResultColumToPropertyMap,
  RetrieverType,
  SortOrder,
} from '@/types';
import { parseDateToLocaleDateTimeString } from '@/utils';

const SEARCH_TABLE_LOCAL_STORAGE_KEY = 'SEARCH_TABLE_LOCAL_STORAGE_KEY';

interface ResultSet<T extends object> {
  items: T[];
  rowExpandingConfiguration?: WfoTableProps<T>['rowExpandingConfiguration'];
}

const getKeyByValueFromMap = <T,>(resultColumToPropertyMap: ResultColumToPropertyMap<T>, field: keyof T) => {
  return [...resultColumToPropertyMap.entries()].find(([, v]) => v === field)?.[0] || '';
};

const getDataFromResponse = <T extends object>(
  data: PaginatedSearchResults,
  resultColumToPropertyMap: ResultColumToPropertyMap<T>,
  uniqueRowId: keyof T,
): {
  items: T[];
  uniqueRowIdToExpandedRowMap?: Record<string, ReactNode>;
} => {
  const searchResult = data?.data;
  if (!searchResult)
    return {
      items: [],
    };

  const responseColumns: Record<string, string | number | null>[] =
    searchResult.map(({ response_columns }) => response_columns) || [];

  const uniqueRowIdToExpandedRowMap: Record<string, ReactNode> = searchResult.reduce(
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
  );

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
    uniqueRowIdToExpandedRowMap,
  };
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
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto); // Part of the search endpoint payload that is passed as the retriever parameter

  // Part of the search endpoint payload that is passed in the q parameter
  const [queryText, setQueryText] = useState<string>('');
  const [resultSet, setResultSet] = useState<ResultSet<SubscriptionListItem>>();
  // String that is displayed in the filter textarea. This is transformed and if valid passed to the search endpoint in the filter parameter
  const [filterString, setFilterString] = useState<string>();
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType | undefined>();
  const [isValidFilterString, setIsValidFilterString] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number | false>(false);
  const [triggerSearch, { isLoading, data }] = useSearchMutation();

  const hasNextPage = data?.page_info.has_next_page || false;
  const nextPageCursor = data?.page_info.next_page_cursor;

  const getStoredTableConfig = useStoredTableConfig<SubscriptionListItem>(SEARCH_TABLE_LOCAL_STORAGE_KEY);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<SubscriptionListItem>>();
  const [pageSize, setPageSize] = useState<number>(tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE);
  const [limit, setLimit] = useState<number>(pageSize);
  const [dataSorting, setDataSorting] = useState<WfoDataSorting<SubscriptionListItem>>({
    field: 'subscriptionId',
    sortOrder: SortOrder.DESC,
  });

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (ruleGroup === false) return false;

    if (!query && !ruleGroup) {
      return parseRuleGroupToFilters(parseCEL(`status=="active"`));
    }
    return parseRuleGroupToFilters(ruleGroup);
  };

  const handleSearch = (searchParams?: SearchParams) => {
    const retriever = searchParams?.retrieverType || retrieverType;
    const query =
      searchParams?.queryText === false ? ''
      : searchParams?.queryText ? searchParams?.queryText
      : queryText || '';

    // If there is no query and no ruleGroup selected we default to something that gives results
    const ruleGroup = searchParams?.ruleGroup === false ? false : searchParams?.ruleGroup || queryBuilderRuleGroup;
    const filters = getFilters(query, ruleGroup);

    const queryLimit: number = searchParams?.limit || limit;

    // TODO: Order by is currently not working with pagination and also not when a query is present
    // disabling it for now. 22-6-26 RVL
    /*
    const order_by =
      searchParams?.sortBy ?
        {
          element: getKeyByValueFromMap(
            resultColumToPropertyMap,
            searchParams?.sortBy.field as keyof SubscriptionListItem,
          ),
          direction: searchParams.sortBy.sortOrder.toLowerCase(),
        }
      : {
          element: getKeyByValueFromMap(resultColumToPropertyMap, dataSorting.field),
          direction: dataSorting.sortOrder.toLowerCase(),
        };
    */
    const searchPayload: SearchPayload = {
      query,
      limit: queryLimit,
      entity_type: EntityKind.SUBSCRIPTION,
      response_columns: Array.from(resultColumToPropertyMap.keys()),
      ...(retriever !== RetrieverType.Auto && { retriever }),
      ...(filters && { filters }),
      // TODO: Order by is currently not working with pagination and also not when a query is present
      // disabling it for now. 22-6-26 RVL
      // ...(order_by && { order_by }),
      ...(searchParams?.cursor && { cursor: searchParams?.cursor }),
    };

    triggerSearch(searchPayload).then(({ data }) => {
      const { items: subscriptionListItems, uniqueRowIdToExpandedRowMap } =
        data ?
          getDataFromResponse<SubscriptionListItem>(data, resultColumToPropertyMap, 'subscriptionId')
        : { items: [] };

      setResultSet((currentResultSet): ResultSet<SubscriptionListItem> => {
        // If we are paginating we add to the current result. If we are doing a new search the result set should be overwritten.
        if (searchParams?.cursor) {
          return {
            items:
              currentResultSet?.items ? [...currentResultSet.items, ...subscriptionListItems] : subscriptionListItems,
            rowExpandingConfiguration: {
              uniqueRowId: 'subscriptionId',
              uniqueRowIdToExpandedRowMap:
                currentResultSet?.rowExpandingConfiguration?.uniqueRowIdToExpandedRowMap ?
                  {
                    ...currentResultSet.rowExpandingConfiguration.uniqueRowIdToExpandedRowMap,
                    ...uniqueRowIdToExpandedRowMap,
                  }
                : uniqueRowIdToExpandedRowMap || {},
            },
          };
        }

        return {
          items: subscriptionListItems,
          rowExpandingConfiguration: {
            uniqueRowId: 'subscriptionId',
            uniqueRowIdToExpandedRowMap: uniqueRowIdToExpandedRowMap || {},
          },
        };
      });

      setTotalItems(data?.cursor?.total_items || false);
    });
  };

  const onChangeQueryText = (queryText: string) => {
    setQueryText(queryText);
  };

  const onSearchQueryText = (queryText: string) => {
    setQueryText(queryText);
    handleSearch({ queryText: queryText || false });
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

  const onShowMore = () => {
    handleSearch({
      cursor: nextPageCursor,
    });
  };

  const onUpdateDataSorting = ({ field, sortOrder }: WfoDataSorting<SubscriptionListItem>) => {
    setDataSorting({ field, sortOrder });
    setLimit(pageSize);

    handleSearch({
      limit: pageSize,
      sortBy: {
        field,
        sortOrder,
      },
    });
  };

  return (
    <>
      <WfoContentHeader title="Subscriptions (POC)" />
      <EuiSpacer size="l" />
      <WfoStructuredSearchTable<SubscriptionListItem>
        data={resultSet?.items || []}
        rowExpandingConfiguration={resultSet?.rowExpandingConfiguration}
        defaultHiddenColumns={tableDefaults?.hiddenColumns}
        filterString={filterString}
        handleSearch={handleSearch}
        isLoading={isLoading}
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
        limit={limit}
        hasNextPage={hasNextPage}
        prefilledFieldOptions={prefilledFieldOptions}
      />
    </>
  );
};
