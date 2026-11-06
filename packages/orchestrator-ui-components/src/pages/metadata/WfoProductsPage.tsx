import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import {
  METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
  PATH_METADATA_PRODUCT_BLOCKS,
  StoredTableConfig,
  WfoDateTime,
  WfoProductBlockBadge,
} from '@/components';
import { WfoMetadataStatusField } from '@/components/WfoMetadata';
import { WfoMetadataDescriptionField } from '@/components/WfoMetadata/WfoMetadataDescriptionField';
import { parseRuleGroupToFilters } from '@/components/WfoSearchPage/utils';
import { WfoConfidenceScore } from '@/components/WfoSubscription/WfoConfidenceScore';
import { WfoMatchingFields } from '@/components/WfoSubscription/WfoMatchingFields';
import {
  TableColumnKeys,
  WfoFirstPartUUID,
  WfoStructuredSearchTable,
  WfoStructuredSearchTableColumnConfig,
  useSearchExport,
  useStructuredSearchState,
} from '@/components/WfoTable';
import { getSearchPathToPropertyMap } from '@/components/WfoTable/WfoStructuredSearchTable/utils';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useStoredTableConfig } from '@/hooks';
import {
  useGetProductListSearchQuery,
  useUpdateProductDescriptionMutation,
  useUpdateProductStatusMutation,
} from '@/rtk';
import type { ProductListSearchResponse } from '@/rtk/endpoints/metadata/products';
import { SearchScore, buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import { BadgeType, EntityKind, MatchingField, ProductDefinition, ProductLifecycleStatus, SortOrder } from '@/types';
import { getProductLifecycleStatus, getQueryUrl, parseDateToLocaleDateTimeString, parseIsoString } from '@/utils';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

// Only the visible columns are present in a hit
export type ProductListItem = ProductDefinition & {
  score?: SearchScore;
};

const STATUS_SEARCH_PATH = 'product.status';

// A search without a query or filter returns nothing, so then the list filters on every lifecycle status
// (like the tabs of the other search lists do). A filter the user committed is used as is.
const buildAllStatusesRuleGroup = (): RuleGroupType => ({
  combinator: 'or',
  rules: Object.values(ProductLifecycleStatus).map((status) => ({
    field: STATUS_SEARCH_PATH,
    operator: '=',
    value: status,
  })),
});

const isEmptySearch = (query: string, userRuleGroup?: RuleGroupType) => !query && !userRuleGroup;

const buildFilters = (query: string, userRuleGroup?: RuleGroupType) => {
  const ruleGroup = isEmptySearch(query, userRuleGroup) ? userRuleGroup : buildAllStatusesRuleGroup();
  return ruleGroup && parseRuleGroupToFilters(ruleGroup);
};

// The matches of the implicit status filter are not interesting to the user
const removeImplicitStatusMatches = (matchingFields: MatchingField[]) =>
  matchingFields.filter(
    ({ path, text }) =>
      path !== STATUS_SEARCH_PATH
      || !Object.values(ProductLifecycleStatus).some((status) => status === text.toLowerCase()),
  );

const ALWAYS_REQUESTED_PROPERTIES: (keyof ProductListItem)[] = ['productId', 'name'];

const getItemsFromGraphqlResponse = (data: ProductListSearchResponse, hasImplicitFilter: boolean): ProductListItem[] =>
  data.searchEdges.map(
    ({ score, matchingFields, node }) =>
      ({
        ...node,
        ...(node.status && { status: getProductLifecycleStatus(node.status) }),
        score: {
          score,
          matchingFields: hasImplicitFilter ? removeImplicitStatusMatches(matchingFields) : matchingFields,
        },
      }) as ProductListItem,
  );

export const WfoProductsPage = () => {
  const t = useTranslations('metadata.products');
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<ProductListItem>>();

  const getStoredTableConfig = useStoredTableConfig<ProductListItem>(METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY);
  const [updateProductDescription] = useUpdateProductDescriptionMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  const {
    committedQueryString,
    committedFilterString,
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
    committedRuleGroup,
  } = useStructuredSearchState<ProductListItem>({
    defaultSorting: { field: 'name', sortOrder: SortOrder.ASC },
  });

  const defaultTableColumns: WfoStructuredSearchTableColumnConfig<ProductListItem> = {
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
    productId: {
      columnType: ColumnType.DATA,
      searchPath: 'product.product_id',
      label: t('id'),
      width: '90px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    name: {
      columnType: ColumnType.DATA,
      searchPath: 'product.name',
      label: t('name'),
      width: '200px',
      renderData: (name) => <WfoProductBlockBadge badgeType={BadgeType.PRODUCT}>{name}</WfoProductBlockBadge>,
    },
    tag: {
      columnType: ColumnType.DATA,
      searchPath: 'product.tag',
      label: t('tag'),
      width: '120px',
      renderData: (value) => <WfoProductBlockBadge badgeType={BadgeType.PRODUCT_TAG}>{value}</WfoProductBlockBadge>,
    },
    description: {
      columnType: ColumnType.DATA,
      searchPath: 'product.description',
      label: t('description'),
      width: '700px',
      renderData: (value, row) => (
        <WfoMetadataDescriptionField
          onSave={(updatedNote) =>
            updateProductDescription({
              id: row.productId,
              description: updatedNote,
            })
          }
          description={value}
        />
      ),
    },
    productType: {
      columnType: ColumnType.DATA,
      searchPath: 'product.product_type',
      label: t('productType'),
      width: '250px',
    },
    status: {
      columnType: ColumnType.DATA,
      searchPath: 'product.status',
      label: t('status'),
      width: '150px',
      renderData: (value, row) => (
        <WfoMetadataStatusField
          onSave={(updatedStatus: ProductLifecycleStatus) =>
            updateProductStatus({
              id: row.productId,
              status: updatedStatus,
            })
          }
          currentStatus={value}
        />
      ),
    },
    fixedInputs: {
      columnType: ColumnType.DATA,
      label: t('fixedInputs'),
      width: '400px',
      renderData: (fixedInputs) => (
        <>
          {fixedInputs.map((fixedInput, index) => (
            <WfoProductBlockBadge key={index} badgeType={BadgeType.FIXED_INPUT}>
              {`${fixedInput.name}: ${fixedInput.value}`}
            </WfoProductBlockBadge>
          ))}
        </>
      ),
      renderTooltip: (fixedInputs) => {
        return fixedInputs.map((fixedInput) => (
          <p key={fixedInput.name}>- {`${fixedInput.name}: ${fixedInput.value}`}</p>
        ));
      },
    },
    productBlocks: {
      columnType: ColumnType.DATA,
      label: t('productBlocks'),
      width: '250px',
      renderData: (productBlocks) => (
        <>
          {productBlocks.map(({ name }, index) => (
            <WfoProductBlockBadge
              key={index}
              link={getQueryUrl(PATH_METADATA_PRODUCT_BLOCKS, `name:"${name}"`)}
              badgeType={BadgeType.PRODUCT_BLOCK}
            >
              {name}
            </WfoProductBlockBadge>
          ))}
        </>
      ),
      renderTooltip: (productBlocks) =>
        productBlocks.map((productBlock) => <p key={productBlock.name}>- {productBlock.name}</p>),
    },
    createdAt: {
      columnType: ColumnType.DATA,
      searchPath: 'product.created_at',
      label: t('createdAt'),
      width: '90px',
      renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
      renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
      clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
      renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
    },
  };

  const searchPathToProperty = getSearchPathToPropertyMap<ProductListItem>(defaultTableColumns);

  // The search payload is derived entirely from the committed search state, which lives in the URL
  const searchPayload = buildGraphqlSearchPayload<ProductListItem>({
    searchPathToProperty,
    alwaysRequestedProperties: ALWAYS_REQUESTED_PROPERTIES,
    hiddenColumns,
    dataSorting,
    query: committedQueryString,
    pageSize,
    retrieverType,
    filters: buildFilters(committedQueryString, committedRuleGroup),
    cursor,
  });
  const { data, error, isFetching } = useGetProductListSearchQuery({
    ...searchPayload,
    includeProductBlocks: !hiddenColumns.includes('productBlocks'),
    includeFixedInputs: !hiddenColumns.includes('fixedInputs'),
  });

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
      initPageSize(storedConfig.selectedPageSize);
    }
  }, [getStoredTableConfig, initPageSize]);

  const sortableAndFilterableFieldNames = [...searchPathToProperty.values()].map(String);
  const isSortingAllowed = queryString === '';
  const tableConfig = mapSortableAndFilterableValuesToTableColumnConfig<ProductListItem>(
    defaultTableColumns,
    isSortingAllowed ? sortableAndFilterableFieldNames : [],
    sortableAndFilterableFieldNames,
  );

  const productListItems =
    data && !isSearchBlocked ?
      getItemsFromGraphqlResponse(data, isEmptySearch(committedQueryString, committedRuleGroup))
    : [];
  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  const { exportData, isExporting } = useSearchExport<ProductListItem>({
    entityKind: EntityKind.PRODUCT,
    searchPathToProperty,
    tableColumnConfig: defaultTableColumns,
    fileName: 'Products',
  });

  const onShowMore = () => {
    if (!isFetching) {
      showNextPage(nextPageCursor);
    }
  };

  // only show 'score' when there is an active query or filter
  const additionalHiddenColumns: TableColumnKeys<ProductListItem> =
    committedQueryString || committedFilterString ? [] : ['score'];

  // We manually show/hide the score column and shouldn't be configurable by the user.
  const nonEditableColumns: TableColumnKeys<ProductListItem> = ['score'];

  return (
    <WfoMetadataPageLayout>
      <WfoStructuredSearchTable<ProductListItem>
        entityKind={EntityKind.PRODUCT}
        data={productListItems}
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
        localStorageKey={METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY}
        onUpdateFilterString={onUpdateFilterString}
        onUpdateQueryBuilder={onUpdateQueryBuilder}
        onChangeQueryString={onChangeQueryString}
        onSearchQueryString={onSearchQueryString}
        onShowMore={onShowMore}
        onUpdateRetrieverType={onUpdateRetrieverType}
        queryBuilderRuleGroup={queryBuilderRuleGroup}
        queryString={queryString}
        retrieverType={retrieverType}
        tableColumnConfig={tableConfig}
        getColumnSearchFieldName={(field) => getSearchPath(searchPathToProperty, field)}
        pageSize={pageSize}
        onUpdateDataSorting={onUpdateDataSorting}
        setPageSize={onUpdatePageSize}
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        onExportData={() => exportData(searchPayload)}
        exportDataIsLoading={isExporting}
      />
    </WfoMetadataPageLayout>
  );
};
