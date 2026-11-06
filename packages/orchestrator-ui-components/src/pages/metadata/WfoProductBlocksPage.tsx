import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';

import {
  METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY,
  PATH_METADATA_PRODUCT_BLOCKS,
  PATH_METADATA_RESOURCE_TYPES,
  StoredTableConfig,
  WfoDateTime,
  WfoProductBlockBadge,
  WfoProductStatusBadge,
} from '@/components';
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
import { WfoRowDetails } from '@/components/WfoTable/WfoStructuredSearchTable';
import {
  SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP,
  buildRowDetailsSearchPayload,
  getSearchPathToPropertyMap,
} from '@/components/WfoTable/WfoStructuredSearchTable/utils';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useStoredTableConfig } from '@/hooks';
import { useGetProductBlockListSearchQuery, useUpdateProductBlockMutation } from '@/rtk';
import type { ProductBlockListSearchResponse } from '@/rtk/endpoints/metadata/productBlocks';
import { SearchScore, buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import {
  BadgeType,
  EntityKind,
  MatchingField,
  ProductBlockDefinition,
  ProductLifecycleStatus,
  ResultColumToPropertyMap,
  SortOrder,
} from '@/types';
import { getProductLifecycleStatus, getQueryUrl, parseDateToLocaleDateTimeString, parseIsoString } from '@/utils';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

// Only the visible columns are present in a hit
export type ProductBlockListItem = ProductBlockDefinition & {
  score?: SearchScore;
};

const STATUS_SEARCH_PATH = 'product_block.status';

// A search without a filter returns nothing, so then the list filters on every lifecycle status
// (like the tabs of the other search lists do). A filter the user committed is used as is.
const buildAllStatusesRuleGroup = (): RuleGroupType => ({
  combinator: 'or',
  rules: Object.values(ProductLifecycleStatus).map((status) => ({
    field: STATUS_SEARCH_PATH,
    operator: SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP.eq,
    value: status,
  })),
});

const buildFilters = (userRuleGroup?: RuleGroupType) =>
  parseRuleGroupToFilters(userRuleGroup ?? buildAllStatusesRuleGroup());

// The matches of the implicit status filter are not interesting to the user
const removeImplicitStatusMatches = (matchingFields: MatchingField[]) =>
  matchingFields.filter(
    ({ path, text }) =>
      path !== STATUS_SEARCH_PATH
      || !Object.values(ProductLifecycleStatus).some((status) => status === text.toLowerCase()),
  );

const ALWAYS_REQUESTED_PROPERTIES: (keyof ProductBlockListItem)[] = ['productBlockId', 'name'];

const getItemsFromGraphqlResponse = (
  data: ProductBlockListSearchResponse,
  hasImplicitFilter: boolean,
): ProductBlockListItem[] =>
  data.searchEdges.map(
    ({ score, matchingFields, node }) =>
      ({
        ...node,
        ...(node.status && { status: getProductLifecycleStatus(node.status) }),
        score: {
          score,
          matchingFields: hasImplicitFilter ? removeImplicitStatusMatches(matchingFields) : matchingFields,
        },
      }) as ProductBlockListItem,
  );

type WfoProductBlockRowDetailsProps = {
  row: ProductBlockListItem;
  searchPathToProperty: ResultColumToPropertyMap<ProductBlockListItem>;
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<ProductBlockListItem>;
};

const WfoProductBlockRowDetails = ({
  row,
  searchPathToProperty,
  tableColumnConfig,
}: WfoProductBlockRowDetailsProps) => {
  const { data, isFetching } = useGetProductBlockListSearchQuery(
    {
      ...buildRowDetailsSearchPayload(searchPathToProperty, 'productBlockId', row.productBlockId),
      includeResourceTypes: true,
      includeDependsOn: true,
    },
    { refetchOnMountOrArgChange: true },
  );

  const detailRow = data && getItemsFromGraphqlResponse(data, false)[0];

  return <WfoRowDetails row={detailRow} isLoading={isFetching} tableColumnConfig={tableColumnConfig} />;
};

export const WfoProductBlocksPage = () => {
  const t = useTranslations('metadata.productBlocks');
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<ProductBlockListItem>>();

  const getStoredTableConfig = useStoredTableConfig<ProductBlockListItem>(
    METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY,
  );
  const [updateProductBlock] = useUpdateProductBlockMutation();

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
  } = useStructuredSearchState<ProductBlockListItem>({
    defaultSorting: { field: 'name', sortOrder: SortOrder.ASC },
  });

  const defaultTableColumns: WfoStructuredSearchTableColumnConfig<ProductBlockListItem> = {
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
    productBlockId: {
      columnType: ColumnType.DATA,
      searchPath: 'product_block.product_block_id',
      label: t('id'),
      width: '90px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    name: {
      columnType: ColumnType.DATA,
      searchPath: 'product_block.name',
      label: t('name'),
      width: '300px',
      renderData: (name) => <WfoProductBlockBadge badgeType={BadgeType.PRODUCT_BLOCK}>{name}</WfoProductBlockBadge>,
    },
    tag: {
      columnType: ColumnType.DATA,
      searchPath: 'product_block.tag',
      label: t('tag'),
      width: '120px',
    },
    description: {
      columnType: ColumnType.DATA,
      searchPath: 'product_block.description',
      label: t('description'),
      width: '700px',
      renderData: (value, row) => (
        <WfoMetadataDescriptionField
          onSave={(updatedNote) =>
            updateProductBlock({
              id: row.productBlockId,
              description: updatedNote,
            })
          }
          description={value}
        />
      ),
    },
    status: {
      columnType: ColumnType.DATA,
      searchPath: STATUS_SEARCH_PATH,
      label: t('status'),
      width: '90px',
      renderData: (value) => <WfoProductStatusBadge status={value} />,
    },
    dependsOn: {
      columnType: ColumnType.DATA,
      label: t('dependingProductBlocks'),
      renderData: (dependsOn) => (
        <>
          {dependsOn.map(({ name }, index) => (
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
      renderTooltip: (productBlocks) => {
        return productBlocks.map((productBlock) => <p key={productBlock.name}>- {productBlock.name}</p>);
      },
    },
    resourceTypes: {
      columnType: ColumnType.DATA,
      label: t('resourceTypes'),
      width: '700px',
      renderData: (resourceTypes) => (
        <>
          {resourceTypes.map(({ resourceType }, index) => (
            <WfoProductBlockBadge
              key={index}
              link={getQueryUrl(PATH_METADATA_RESOURCE_TYPES, `resourceType:"${resourceType}"`)}
              badgeType={BadgeType.RESOURCE_TYPE}
            >
              {resourceType}
            </WfoProductBlockBadge>
          ))}
        </>
      ),
      renderDetails: (resourceTypes) => (
        <EuiBadgeGroup gutterSize="s">
          {resourceTypes.map(({ resourceType }, index) => (
            <WfoProductBlockBadge
              key={index}
              link={getQueryUrl(PATH_METADATA_RESOURCE_TYPES, `resourceType:"${resourceType}"`)}
              badgeType={BadgeType.RESOURCE_TYPE}
            >
              {resourceType}
            </WfoProductBlockBadge>
          ))}
        </EuiBadgeGroup>
      ),
      renderTooltip: (resourceTypes) => {
        return resourceTypes.map((resourceType) => (
          <p key={resourceType.resourceType}>- {resourceType.resourceType}</p>
        ));
      },
    },
    createdAt: {
      columnType: ColumnType.DATA,
      searchPath: 'product_block.created_at',
      label: t('createdAt'),
      width: '120px',
      renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
      renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
      clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
      renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
    },
    endDate: {
      columnType: ColumnType.DATA,
      searchPath: 'product_block.end_date',
      label: t('endDate'),
      width: '120px',
      renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
      renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
      clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
      renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
    },
  };

  const searchPathToProperty = getSearchPathToPropertyMap<ProductBlockListItem>(defaultTableColumns);

  // The search payload is derived entirely from the committed search state, which lives in the URL
  const searchPayload = buildGraphqlSearchPayload<ProductBlockListItem>({
    searchPathToProperty,
    alwaysRequestedProperties: ALWAYS_REQUESTED_PROPERTIES,
    hiddenColumns,
    dataSorting,
    query: committedQueryString,
    pageSize,
    retrieverType,
    filters: buildFilters(committedRuleGroup),
    cursor,
  });
  const { data, error, isFetching } = useGetProductBlockListSearchQuery({
    ...searchPayload,
    includeResourceTypes: !hiddenColumns.includes('resourceTypes'),
    includeDependsOn: !hiddenColumns.includes('dependsOn'),
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
  const tableConfig = mapSortableAndFilterableValuesToTableColumnConfig<ProductBlockListItem>(
    defaultTableColumns,
    isSortingAllowed ? sortableAndFilterableFieldNames : [],
    sortableAndFilterableFieldNames,
  );

  const productBlockListItems = data && !isSearchBlocked ? getItemsFromGraphqlResponse(data, !committedRuleGroup) : [];
  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  const { exportData, isExporting } = useSearchExport<ProductBlockListItem>({
    entityKind: EntityKind.PRODUCT_BLOCK,
    searchPathToProperty,
    tableColumnConfig: defaultTableColumns,
    fileName: 'ProductBlocks',
  });

  const onShowMore = () => {
    if (!isFetching) {
      showNextPage(nextPageCursor);
    }
  };

  // only show 'score' when there is an active query or filter
  const additionalHiddenColumns: TableColumnKeys<ProductBlockListItem> =
    committedQueryString || committedFilterString ? [] : ['score'];

  // We manually show/hide the score column and shouldn't be configurable by the user.
  const nonEditableColumns: TableColumnKeys<ProductBlockListItem> = ['score'];

  const renderRowDetails = (row: ProductBlockListItem) => (
    <WfoProductBlockRowDetails
      row={row}
      searchPathToProperty={searchPathToProperty}
      tableColumnConfig={defaultTableColumns}
    />
  );

  return (
    <WfoMetadataPageLayout>
      <WfoStructuredSearchTable<ProductBlockListItem>
        entityKind={EntityKind.PRODUCT_BLOCK}
        renderRowDetails={renderRowDetails}
        data={productBlockListItems}
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
        localStorageKey={METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY}
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
