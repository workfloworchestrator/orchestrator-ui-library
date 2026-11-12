import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { EuiBadgeGroup, EuiButtonIcon, EuiContextMenuItem } from '@elastic/eui';

import {
  PATH_METADATA_ADD_SCHEDULE_TASK_FORM,
  PATH_METADATA_PRODUCTS,
  StoredTableConfig,
  WfoDateTime,
  WfoFirstPartUUID,
  WfoPopover,
  WfoProductBlockBadge,
  WfoScheduledTasksBadgesContainer,
  WfoWorkflowTargetBadge,
} from '@/components';
import { WfoMetadataDescriptionField } from '@/components/WfoMetadata/WfoMetadataDescriptionField';
import { parseRuleGroupToFilters } from '@/components/WfoSearchPage/utils';
import { WfoConfidenceScore } from '@/components/WfoSubscription/WfoConfidenceScore';
import { WfoMatchingFields } from '@/components/WfoSubscription/WfoMatchingFields';
import {
  TableColumnKeys,
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
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import { useGetWorkflowListSearchQuery, useUpdateWorkflowMutation } from '@/rtk';
import type { WorkflowListSearchPayload, WorkflowListSearchResponse } from '@/rtk/endpoints/metadata/workflows';
import { SearchScore, buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import {
  BadgeType,
  EntityKind,
  ResultColumToPropertyMap,
  ScheduleFrequency,
  SortOrder,
  WorkflowDefinition,
  WorkflowTarget,
} from '@/types';
import { getQueryUrl, onlyUnique, parseDateToLocaleDateTimeString, parseIsoString } from '@/utils';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

export type WorkflowListItem = Pick<
  WorkflowDefinition,
  'workflowId' | 'name' | 'description' | 'target' | 'createdAt'
> & {
  productTags: string[];
  score?: SearchScore;
};

export type TaskListItem = WorkflowListItem & {
  scheduleFrequency: ScheduleFrequency[];
};

type ListItem = WorkflowListItem & Partial<Pick<TaskListItem, 'scheduleFrequency'>>;

const ALWAYS_REQUESTED_PROPERTIES: (keyof ListItem)[] = ['workflowId', 'name'];

// The workflows list shows the workflows that start a subscription lifecycle step, not the system workflows
const WORKFLOW_TARGETS = [
  WorkflowTarget.CREATE,
  WorkflowTarget.MODIFY,
  WorkflowTarget.TERMINATE,
  WorkflowTarget.RECONCILE,
];

const buildListRuleGroup = (isTask: boolean): RuleGroupType =>
  isTask ?
    {
      combinator: 'and',
      rules: [{ field: 'workflow.is_task', operator: SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP.eq, value: true }],
    }
  : {
      combinator: 'or',
      rules: WORKFLOW_TARGETS.map((target) => ({
        field: 'workflow.target',
        operator: SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP.eq,
        value: target,
      })),
    };

// The filter of the list and the filter the user committed, combined into one search filter
const buildListAndUserFilters = (isTask: boolean, userRuleGroup?: RuleGroupType) => {
  const ruleGroups = [buildListRuleGroup(isTask), userRuleGroup].filter(Boolean) as RuleGroupType[];
  return parseRuleGroupToFilters(ruleGroups.length === 1 ? ruleGroups[0] : { combinator: 'and', rules: ruleGroups });
};

const getItemsFromGraphqlResponse = (data: WorkflowListSearchResponse): ListItem[] =>
  data.searchEdges.map(
    ({ score, matchingFields, node }) =>
      ({
        ...node,
        productTags: node.products?.map(({ tag }) => tag) ?? [],
        scheduleFrequency: [],
        score: { score, matchingFields },
      }) as ListItem,
  );

type WfoWorkflowRowDetailsProps = {
  row: ListItem;
  searchPathToProperty: ResultColumToPropertyMap<ListItem>;
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<ListItem>;
};

// The table request leaves out the hidden columns, so the details modal loads the full workflow or task
const WfoWorkflowRowDetails = ({ row, searchPathToProperty, tableColumnConfig }: WfoWorkflowRowDetailsProps) => {
  const { data, isFetching } = useGetWorkflowListSearchQuery(
    { ...buildRowDetailsSearchPayload(searchPathToProperty, 'workflowId', row.workflowId), includeProducts: true },
    { refetchOnMountOrArgChange: true },
  );

  const detailRow = data && getItemsFromGraphqlResponse(data)[0];

  return <WfoRowDetails row={detailRow} isLoading={isFetching} tableColumnConfig={tableColumnConfig} />;
};

const ScheduleTaskPopoverMenu = ({ workflowId }: { workflowId: string }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const button = (
    <EuiButtonIcon
      iconType={() => <WfoDotsHorizontal />}
      onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      aria-label="Schedule task popover menu"
      isLoading={false}
    />
  );

  return (
    <WfoPopover
      id="schedule-task-popover-menu"
      isLoading={false}
      PopoverContent={() => <SetScheduleButton workflowId={workflowId} closePopover={() => setIsPopoverOpen(false)} />}
      button={button}
      isPopoverOpen={isPopoverOpen}
      closePopover={() => setIsPopoverOpen(false)}
    />
  );
};

const SetScheduleButton = ({ workflowId, closePopover }: { workflowId: string; closePopover: () => void }) => {
  const t = useTranslations('metadata.tasks');
  const router = useRouter();
  return (
    <EuiContextMenuItem
      icon="gear"
      css={{
        whiteSpace: 'nowrap',
      }}
      onClick={() => {
        closePopover();
        router.push(`${PATH_METADATA_ADD_SCHEDULE_TASK_FORM}/?workflowId=${workflowId}`);
      }}
    >
      {t('addSchedule')}
    </EuiContextMenuItem>
  );
};

export type WfoWorkflowDefinitionsListProps = {
  isTask: boolean;
  localStorageKey: string;
};

// The metadata list of the workflows or of the tasks, searched with the GraphQL `workflows` search
export const WfoWorkflowDefinitionsList = ({ isTask, localStorageKey }: WfoWorkflowDefinitionsListProps) => {
  const t = useTranslations(isTask ? 'metadata.tasks' : 'metadata.workflows');
  const tProcesses = useTranslations('processes.index');
  const [updateWorkflow] = useUpdateWorkflowMutation();

  const getStoredTableConfig = useStoredTableConfig<ListItem>(localStorageKey);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<ListItem>>();
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
  } = useStructuredSearchState<ListItem>({
    defaultSorting: { field: 'name', sortOrder: SortOrder.ASC },
  });

  const productTagBadge = (productTag: string, index: number) => (
    <WfoProductBlockBadge
      key={index}
      link={getQueryUrl(PATH_METADATA_PRODUCTS, `tag:"${productTag}"`)}
      badgeType={BadgeType.PRODUCT_TAG}
    >
      {productTag}
    </WfoProductBlockBadge>
  );

  const defaultTableColumns: WfoStructuredSearchTableColumnConfig<ListItem> = {
    score: {
      columnType: ColumnType.DATA,
      label: tProcesses('score'),
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
    workflowId: {
      columnType: ColumnType.DATA,
      searchPath: 'workflow.workflow_id',
      label: t('workflowId'),
      width: '95px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    name: {
      columnType: ColumnType.DATA,
      searchPath: 'workflow.name',
      label: t('name'),
      width: isTask ? '300px' : '350px',
      renderData: (name) => (
        <WfoProductBlockBadge badgeType={isTask ? BadgeType.TASK : BadgeType.WORKFLOW}>{name}</WfoProductBlockBadge>
      ),
    },
    description: {
      columnType: ColumnType.DATA,
      searchPath: 'workflow.description',
      label: t('description'),
      width: '700px',
      renderData: (value, row) => (
        <WfoMetadataDescriptionField
          onSave={(updatedNote) => updateWorkflow({ id: row.workflowId, description: updatedNote })}
          description={value}
        />
      ),
    },
    target: {
      columnType: ColumnType.DATA,
      searchPath: 'workflow.target',
      label: t('target'),
      width: '100px',
      renderData: (target) => <WfoWorkflowTargetBadge target={target} />,
    },
    productTags: {
      columnType: ColumnType.DATA,
      label: t('productTags'),
      width: isTask ? '250px' : '300px',
      renderData: (productTags) => <>{productTags?.filter(onlyUnique).map(productTagBadge)}</>,
      renderDetails: (productTags) => (
        <EuiBadgeGroup gutterSize="s">{productTags?.filter(onlyUnique).map(productTagBadge)}</EuiBadgeGroup>
      ),
      renderTooltip: (productTags) =>
        productTags
          ?.filter(onlyUnique)
          .sort((tagA, tagB) => tagA.localeCompare(tagB))
          .map((productTag) => <p key={productTag}>- {productTag}</p>),
    },
    ...(isTask && {
      scheduleFrequency: {
        columnType: ColumnType.DATA,
        label: t('scheduled'),
        width: '80px',
        renderData: (_: unknown, row: ListItem) => <WfoScheduledTasksBadgesContainer workflowId={row.workflowId} />,
      },
    }),
    createdAt: {
      columnType: ColumnType.DATA,
      searchPath: 'workflow.created_at',
      label: t('createdAt'),
      width: isTask ? '150px' : '100px',
      renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
      renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
      clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
      renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
    },
    ...(isTask && {
      addSchedule: {
        columnType: ColumnType.CONTROL,
        width: '80px',
        renderControl: (row: ListItem) => <ScheduleTaskPopoverMenu workflowId={row.workflowId} />,
      },
    }),
  };

  const searchPathToProperty = getSearchPathToPropertyMap<ListItem>(defaultTableColumns);

  // The search payload is derived entirely from the committed search state, which lives in the URL
  const searchPayload: WorkflowListSearchPayload = {
    ...buildGraphqlSearchPayload<ListItem>({
      searchPathToProperty,
      alwaysRequestedProperties: ALWAYS_REQUESTED_PROPERTIES,
      hiddenColumns,
      dataSorting,
      query: committedQueryString,
      pageSize,
      retrieverType,
      filters: buildListAndUserFilters(isTask, committedRuleGroup),
      cursor,
    }),
    includeProducts: !hiddenColumns.includes('productTags'),
  };

  const { data, error, isFetching } = useGetWorkflowListSearchQuery(searchPayload);

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
      initPageSize(storedConfig.selectedPageSize);
    }
  }, [getStoredTableConfig, initPageSize]);

  const sortableAndFilterableFieldNames = [...searchPathToProperty.values()].map(String);
  const isSortingAllowed = queryString === '';
  const tableConfig = mapSortableAndFilterableValuesToTableColumnConfig<ListItem>(
    defaultTableColumns,
    isSortingAllowed ? sortableAndFilterableFieldNames : [],
    sortableAndFilterableFieldNames,
  );

  const items = data && !isSearchBlocked ? getItemsFromGraphqlResponse(data) : [];
  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  const { exportData, isExporting } = useSearchExport<ListItem>({
    entityKind: EntityKind.WORKFLOW,
    searchPathToProperty,
    tableColumnConfig: defaultTableColumns,
    fileName: isTask ? 'Tasks' : 'Workflows',
  });

  const onShowMore = () => {
    if (!isFetching) {
      showNextPage(nextPageCursor);
    }
  };

  // only show 'score' when there is an active query or filter, and it is not configurable by the user
  const additionalHiddenColumns: TableColumnKeys<ListItem> =
    committedQueryString || committedFilterString ? [] : ['score'];
  const nonEditableColumns: TableColumnKeys<ListItem> = ['score'];

  const renderRowDetails = (row: ListItem) => (
    <WfoWorkflowRowDetails row={row} searchPathToProperty={searchPathToProperty} tableColumnConfig={tableConfig} />
  );

  return (
    <WfoMetadataPageLayout>
      <WfoStructuredSearchTable<ListItem>
        entityKind={EntityKind.WORKFLOW}
        detailModalTitle={isTask ? 'Details - Task' : 'Details - Workflow'}
        renderRowDetails={renderRowDetails}
        data={items}
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
        localStorageKey={localStorageKey}
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
