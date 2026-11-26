import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';

import {
  METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
  PATH_METADATA_PRODUCT_BLOCKS,
  WfoProductBlockBadge,
} from '@/components';
import type { StoredTableConfig } from '@/components';
import { WfoMetadataDescriptionField } from '@/components/WfoMetadata/WfoMetadataDescriptionField';
import { WfoConfidenceScore } from '@/components/WfoSubscription/WfoConfidenceScore';
import { WfoMatchingFields } from '@/components/WfoSubscription/WfoMatchingFields';
import { parseRuleGroupToFilters } from '@/components/WfoSubscriptionsList/subscriptionListTabs';
import {
  TableColumnKeys,
  WfoFirstPartUUID,
  WfoStructuredSearchTable,
  WfoStructuredSearchTableColumnConfig,
  useStructuredSearchState,
} from '@/components/WfoTable';
import { WfoRowDetails } from '@/components/WfoTable/WfoStructuredSearchTable';
import { getSearchPathToPropertyMap } from '@/components/WfoTable/WfoStructuredSearchTable/utils';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useStoredTableConfig } from '@/hooks';
import { useGetResourceTypeListSearchQuery, useUpdateResourceTypeMutation } from '@/rtk';
import type { ResourceTypeListSearchResponse } from '@/rtk/endpoints/metadata/resourceTypes';
import { SearchScore, buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import {
  BadgeType,
  EntityKind,
  MatchingField,
  QueryCombinator,
  QueryOperator,
  ResourceTypeDefinition,
  SortOrder,
} from '@/types';
import { getQueryUrl } from '@/utils';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';
import { useResourceTypeListExport } from './resourceTypeListExport';

// Only the visible columns are present in a hit
export type ResourceTypeListItem = ResourceTypeDefinition & {
  score?: SearchScore;
};

const RESOURCE_TYPE_ID_SEARCH_PATH = 'resource_type.resource_type_id';

// A search without a query or filter returns nothing, so then the list filters on every resource type having an
// id, which is all of them (resource types have no status to filter on, like the other metadata lists).
// A filter the user committed is used as is.
const buildAllResourceTypesRuleGroup = (): RuleGroupType => ({
  combinator: QueryCombinator.AND,
  rules: [{ field: RESOURCE_TYPE_ID_SEARCH_PATH, operator: QueryOperator.IS_NOT_NULL, value: '' }],
});

export const RESOURCE_TYPE_FIELD_TYPE: keyof ResourceTypeDefinition = 'resourceType';
const isEmptySearch = (query: string, userRuleGroup?: RuleGroupType) => !query && !userRuleGroup;

const buildFilters = (query: string, userRuleGroup?: RuleGroupType) => {
  const ruleGroup = isEmptySearch(query, userRuleGroup) ? buildAllResourceTypesRuleGroup() : userRuleGroup;
  return ruleGroup && parseRuleGroupToFilters(ruleGroup);
};

// The matches of the implicit filter are not interesting to the user
const removeImplicitMatches = (matchingFields: MatchingField[]) =>
  matchingFields.filter(({ path }) => path !== RESOURCE_TYPE_ID_SEARCH_PATH);

const ALWAYS_REQUESTED_PROPERTIES: (keyof ResourceTypeListItem)[] = ['resourceTypeId', 'resourceType'];

const getItemsFromGraphqlResponse = (
  data: ResourceTypeListSearchResponse,
  hasImplicitFilter: boolean,
): ResourceTypeListItem[] =>
  data.searchEdges.map(({ score, matchingFields, node }) => ({
    ...node,
    score: { score, matchingFields: hasImplicitFilter ? removeImplicitMatches(matchingFields) : matchingFields },
  }));

type WfoResourceTypeRowDetailsProps = {
  row: ResourceTypeListItem;
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<ResourceTypeListItem>;
};

// All columns are loaded with the row, so the details modal shows the row from the table instead of fetching it again
const WfoResourceTypeRowDetails = ({ row, tableColumnConfig }: WfoResourceTypeRowDetailsProps) => (
  <WfoRowDetails row={row} isLoading={false} tableColumnConfig={tableColumnConfig} />
);

export const WfoResourceTypesPage = () => {
  const t = useTranslations('metadata.resourceTypes');
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<ResourceTypeListItem>>();

  const getStoredTableConfig = useStoredTableConfig<ResourceTypeListItem>(
    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
  );
  const [updateResourceType] = useUpdateResourceTypeMutation();

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
    pageIndex,
    loadedPageCount,
    showPage,
    onShowNextPage,
    committedRuleGroup,
  } = useStructuredSearchState<ResourceTypeListItem>({
    defaultSorting: { field: 'resourceType', sortOrder: SortOrder.ASC },
  });

  const defaultTableColumns: WfoStructuredSearchTableColumnConfig<ResourceTypeListItem> = {
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
    resourceTypeId: {
      columnType: ColumnType.DATA,
      searchPath: RESOURCE_TYPE_ID_SEARCH_PATH,
      label: t('resourceId'),
      width: '90px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    resourceType: {
      columnType: ColumnType.DATA,
      searchPath: 'resource_type.resource_type',
      label: t('type'),
      width: '225px',
      renderData: (value) => <WfoProductBlockBadge badgeType={BadgeType.RESOURCE_TYPE}>{value}</WfoProductBlockBadge>,
    },
    description: {
      columnType: ColumnType.DATA,
      searchPath: 'resource_type.description',
      label: t('description'),
      width: '700px',
      renderData: (value, row) => (
        <WfoMetadataDescriptionField
          onSave={(updatedNote) =>
            updateResourceType({
              id: row.resourceTypeId,
              description: updatedNote,
            })
          }
          description={value}
        />
      ),
    },
    productBlocks: {
      columnType: ColumnType.DATA,
      label: t('usedInProductBlocks'),
      width: '1000px',
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
      renderDetails: (productBlocks) => (
        <EuiBadgeGroup gutterSize="s">
          {productBlocks.map(({ name }, index) => (
            <WfoProductBlockBadge
              key={index}
              link={getQueryUrl(PATH_METADATA_PRODUCT_BLOCKS, `name:"${name}"`)}
              badgeType={BadgeType.PRODUCT_BLOCK}
            >
              {name}
            </WfoProductBlockBadge>
          ))}
        </EuiBadgeGroup>
      ),
      renderTooltip: (productBlocks) => {
        return productBlocks.map((productBlock) => <p key={productBlock.name}>- {productBlock.name}</p>);
      },
    },
  };

  const searchPathToProperty = getSearchPathToPropertyMap<ResourceTypeListItem>(defaultTableColumns);

  // The search payload is derived entirely from the committed search state, which lives in the URL
  const searchPayload = buildGraphqlSearchPayload<ResourceTypeListItem>({
    searchPathToProperty,
    alwaysRequestedProperties: ALWAYS_REQUESTED_PROPERTIES,
    hiddenColumns,
    dataSorting,
    query: committedQueryString,
    pageSize,
    pageIndex,
    retrieverType,
    filters: buildFilters(committedQueryString, committedRuleGroup),
    cursor,
  });
  const { data, error, isFetching } = useGetResourceTypeListSearchQuery(searchPayload);

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
      initPageSize(storedConfig.selectedPageSize);
    }
  }, [getStoredTableConfig, initPageSize]);

  const sortableAndFilterableFieldNames = [...searchPathToProperty.values()].map(String);
  const isSortingAllowed = queryString === '';
  const tableConfig = mapSortableAndFilterableValuesToTableColumnConfig<ResourceTypeListItem>(
    defaultTableColumns,
    isSortingAllowed ? sortableAndFilterableFieldNames : [],
    sortableAndFilterableFieldNames,
  );

  const resourceTypeListItems =
    data && !isSearchBlocked ?
      getItemsFromGraphqlResponse(data, isEmptySearch(committedQueryString, committedRuleGroup))
    : [];
  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  // The old export: the search export has no paths for the nested productBlocks list.
  // The collection query can only apply the text search, so a committed filter is not applied to its rows.
  const { exportData, isExporting } = useResourceTypeListExport(
    defaultTableColumns,
    dataSorting,
    pageSize,
    committedQueryString,
  );

  const onShowNextPageFromCursor = () => {
    if (!isFetching) {
      onShowNextPage(nextPageCursor);
    }
  };

  // only show 'score' when there is an active query or filter
  const additionalHiddenColumns: TableColumnKeys<ResourceTypeListItem> =
    committedQueryString || committedFilterString ? [] : ['score'];

  // We manually show/hide the score column and shouldn't be configurable by the user.
  const nonEditableColumns: TableColumnKeys<ResourceTypeListItem> = ['score'];

  const renderRowDetails = (row: ResourceTypeListItem) => (
    <WfoResourceTypeRowDetails row={row} tableColumnConfig={tableConfig} />
  );

  return (
    <WfoMetadataPageLayout>
      <WfoStructuredSearchTable<ResourceTypeListItem>
        entityKind={EntityKind.RESOURCE_TYPE}
        detailModalTitle="Details - Resource type"
        renderRowDetails={renderRowDetails}
        data={resourceTypeListItems}
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
        localStorageKey={METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY}
        onUpdateFilterString={onUpdateFilterString}
        onUpdateQueryBuilder={onUpdateQueryBuilder}
        onChangeQueryString={onChangeQueryString}
        onSearchQueryString={onSearchQueryString}
        pageIndex={pageIndex}
        onChangePage={showPage}
        onShowNextPage={onShowNextPageFromCursor}
        paginationMode={committedQueryString ? 'cursor' : 'offset'}
        loadedPageCount={loadedPageCount}
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
        onExportData={exportData}
        exportDataIsLoading={isExporting}
      />
    </WfoMetadataPageLayout>
  );
};
