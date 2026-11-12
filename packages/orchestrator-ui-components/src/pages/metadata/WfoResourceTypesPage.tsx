import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';

import {
  METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
  PATH_METADATA_PRODUCT_BLOCKS,
  WfoProductBlockBadge,
} from '@/components';
import type { StoredTableConfig } from '@/components';
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
  buildRowDetailsSearchPayload,
  getSearchPathToPropertyMap,
} from '@/components/WfoTable/WfoStructuredSearchTable/utils';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useStoredTableConfig } from '@/hooks';
import { useGetResourceTypeListSearchQuery, useUpdateResourceTypeMutation } from '@/rtk';
import type { ResourceTypeListSearchResponse } from '@/rtk/endpoints/metadata/resourceTypes';
import { SearchScore, buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import { BadgeType, EntityKind, ResourceTypeDefinition, ResultColumToPropertyMap, SortOrder } from '@/types';
import { getQueryUrl } from '@/utils';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

// Only the visible columns are present in a hit
export type ResourceTypeListItem = ResourceTypeDefinition & {
  score?: SearchScore;
};

const ALWAYS_REQUESTED_PROPERTIES: (keyof ResourceTypeListItem)[] = ['resourceTypeId', 'resourceType'];

const getItemsFromGraphqlResponse = (data: ResourceTypeListSearchResponse): ResourceTypeListItem[] =>
  data.searchEdges.map(
    ({ score, matchingFields, node }) =>
      ({
        ...node,
        score: { score, matchingFields },
      }) as ResourceTypeListItem,
  );

type WfoResourceTypeRowDetailsProps = {
  row: ResourceTypeListItem;
  searchPathToProperty: ResultColumToPropertyMap<ResourceTypeListItem>;
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<ResourceTypeListItem>;
};

const WfoResourceTypeRowDetails = ({
  row,
  searchPathToProperty,
  tableColumnConfig,
}: WfoResourceTypeRowDetailsProps) => {
  const { data, isFetching } = useGetResourceTypeListSearchQuery(
    {
      ...buildRowDetailsSearchPayload(searchPathToProperty, 'resourceTypeId', row.resourceTypeId),
      includeProductBlocks: true,
    },
    { refetchOnMountOrArgChange: true },
  );

  const detailRow = data && getItemsFromGraphqlResponse(data)[0];

  return <WfoRowDetails row={detailRow} isLoading={isFetching} tableColumnConfig={tableColumnConfig} />;
};

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
    showNextPage,
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
      searchPath: 'resource_type.resource_type_id',
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
    retrieverType,
    filters: committedRuleGroup && parseRuleGroupToFilters(committedRuleGroup),
    cursor,
  });
  const { data, error, isFetching } = useGetResourceTypeListSearchQuery({
    ...searchPayload,
    includeProductBlocks: !hiddenColumns.includes('productBlocks'),
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
  const tableConfig = mapSortableAndFilterableValuesToTableColumnConfig<ResourceTypeListItem>(
    defaultTableColumns,
    isSortingAllowed ? sortableAndFilterableFieldNames : [],
    sortableAndFilterableFieldNames,
  );

  const resourceTypeListItems = data && !isSearchBlocked ? getItemsFromGraphqlResponse(data) : [];
  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  const { exportData, isExporting } = useSearchExport<ResourceTypeListItem>({
    entityKind: EntityKind.RESOURCE_TYPE,
    searchPathToProperty,
    tableColumnConfig: defaultTableColumns,
    fileName: 'ResourceTypes',
  });

  const onShowMore = () => {
    if (!isFetching) {
      showNextPage(nextPageCursor);
    }
  };

  // only show 'score' when there is an active query or filter
  const additionalHiddenColumns: TableColumnKeys<ResourceTypeListItem> =
    committedQueryString || committedFilterString ? [] : ['score'];

  // We manually show/hide the score column and shouldn't be configurable by the user.
  const nonEditableColumns: TableColumnKeys<ResourceTypeListItem> = ['score'];

  const renderRowDetails = (row: ResourceTypeListItem) => (
    <WfoResourceTypeRowDetails row={row} searchPathToProperty={searchPathToProperty} tableColumnConfig={tableConfig} />
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
