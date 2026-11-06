import React, { useEffect, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  PATH_WORKFLOWS,
  StoredTableConfig,
  WfoDateTime,
  WfoFilterTab,
  WfoProcessListNoteEdit,
  WfoProcessStatusBadge,
  WfoWorkflowTargetBadge,
} from '@/components';
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
import { WfoProcessListSubscriptionsCell } from '@/pages';
import { useGetProcessListSearchQuery } from '@/rtk';
import type {
  ProcessListSearchPayload,
  ProcessListSearchResponse,
  ProcessSubscriptions,
} from '@/rtk/endpoints/processList';
import { SearchScore, buildGraphqlSearchPayload, getSearchPath } from '@/rtk/graphqlSearch';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import { EntityKind, Process, ProcessStatus, SortOrder } from '@/types';
import { parseDate, parseDateToLocaleDateTimeString } from '@/utils';

import { WfoProcessListActions } from './WfoProcessListActions';
import { WfoProcessListDeltaPopover } from './WfoProcessListDeltaPopover';

export type ProcessListItem = Pick<
  Process,
  | 'workflowName'
  | 'lastStep'
  | 'lastStatus'
  | 'workflowTarget'
  | 'createdBy'
  | 'assignee'
  | 'processId'
  | 'note'
  | 'userPermissions'
  | 'isTask'
> & {
  startedAt: Date;
  lastModifiedAt: Date;
  'product.name'?: string;
  'product.tag'?: string;
  'customer.fullname': string;
  'customer.shortcode': string;
  subscriptions?: ProcessSubscriptions;
  score?: SearchScore;
};

const getSubscriptions = (value?: ProcessSubscriptions) => value?.searchEdges.map(({ node }) => node) ?? [];

const ALWAYS_REQUESTED_PROPERTIES: (keyof ProcessListItem)[] = ['processId', 'workflowName', 'lastStatus'];

const buildTabRuleGroup = (isTask: boolean, statuses: ProcessStatus[]): RuleGroupType => ({
  combinator: 'and',
  rules: [
    { field: 'process.is_task', operator: '=', value: isTask },
    {
      combinator: 'or',
      rules: statuses.map((status) => ({
        field: 'process.last_status',
        operator: '=',
        value: status,
      })),
    },
  ],
});

// The filters of the tab and the filter the user committed, combined into one search filter
const buildTabAndUserFilters = (isTask: boolean, statuses: ProcessStatus[], userRuleGroup?: RuleGroupType) => {
  const ruleGroups = [buildTabRuleGroup(isTask, statuses), userRuleGroup].filter(Boolean) as RuleGroupType[];
  return parseRuleGroupToFilters(ruleGroups.length === 1 ? ruleGroups[0] : { combinator: 'and', rules: ruleGroups });
};

const getItemsFromGraphqlResponse = (data: ProcessListSearchResponse): ProcessListItem[] =>
  data.searchEdges.map(
    ({ score, matchingFields, node }) =>
      ({
        ...node,
        'product.name': node.product?.name,
        'product.tag': node.product?.tag,
        'customer.fullname': node.customer?.fullname,
        'customer.shortcode': node.customer?.shortcode,
        startedAt: parseDate(node.startedAt),
        lastModifiedAt: parseDate(node.lastModifiedAt),
        score: { score, matchingFields },
      }) as ProcessListItem,
  );

// A filter tab of a process list: the statuses of the processes that it lists
export type WfoProcessListTab<TabType> = WfoFilterTab<TabType> & { statuses: ProcessStatus[] };

export type WfoProcessesListProps = {
  isTask: boolean;
  statuses: ProcessStatus[];
  defaultHiddenColumns?: TableColumnKeys<ProcessListItem>;
  localStorageKey: string;
  overrideDefaultTableColumns?: (
    defaultTableColumns: WfoStructuredSearchTableColumnConfig<ProcessListItem>,
  ) => WfoStructuredSearchTableColumnConfig<ProcessListItem>;
};

export const WfoProcessesList = ({
  isTask,
  statuses,
  localStorageKey,
  overrideDefaultTableColumns,
}: WfoProcessesListProps) => {
  const t = useTranslations('processes.index');
  const router = useRouter();
  const getStoredTableConfig = useStoredTableConfig<ProcessListItem>(localStorageKey);
  const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<ProcessListItem>>();
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
    resetPageCursor,
    showNextPage,
  } = useStructuredSearchState<ProcessListItem>({
    defaultSorting: { field: 'lastModifiedAt', sortOrder: SortOrder.DESC },
    // A cursor is only valid within the tab it was requested for
    searchKeyScope: [isTask, statuses],
  });

  const defaultTableColumns: WfoStructuredSearchTableColumnConfig<ProcessListItem> = {
    delta: {
      columnType: ColumnType.CONTROL,
      width: '50px',
      renderControl: (row) => <WfoProcessListDeltaPopover processListItem={row} />,
    },
    actions: {
      columnType: ColumnType.CONTROL,
      width: '36px',
      renderControl: (row) => <WfoProcessListActions processListItem={row} />,
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
    workflowName: {
      columnType: ColumnType.DATA,
      searchPath: 'process.workflow_name',
      label: t('workflowName'),
      width: '225px',
      renderData: (value, { processId }) => <Link href={`${PATH_WORKFLOWS}/${processId}`}>{value}</Link>,
      renderTooltip: (value) => value,
    },
    lastStep: {
      columnType: ColumnType.DATA,
      searchPath: 'process.last_step',
      label: t('step'),
      width: '375px',
    },
    lastStatus: {
      columnType: ColumnType.DATA,
      searchPath: 'process.last_status',
      label: t('status'),
      renderData: (cellValue) => <WfoProcessStatusBadge processStatus={cellValue} />,
      width: '150px',
    },
    workflowTarget: {
      columnType: ColumnType.DATA,
      searchPath: 'process.workflow_target',
      label: t('workflowTarget'),
      renderData: (target) => <WfoWorkflowTargetBadge target={target} />,
      width: '100px',
    },
    'product.tag': {
      columnType: ColumnType.DATA,
      searchPath: 'product_tag',
      label: t('productTag'),
      width: '100px',
    },
    'product.name': {
      columnType: ColumnType.DATA,
      searchPath: 'product_name',
      label: t('product'),
      width: '275px',
    },
    'customer.fullname': {
      columnType: ColumnType.DATA,
      searchPath: 'customer_name',
      label: t('customer'),
      width: '250px',
    },
    'customer.shortcode': {
      columnType: ColumnType.DATA,
      searchPath: 'customer_abbreviation',
      label: t('customerAbbreviation'),
      width: '125px',
    },
    note: {
      columnType: ColumnType.DATA,
      searchPath: 'process.note',
      label: t('note'),
      width: '250px',
      renderData: (note, { processId }) => <WfoProcessListNoteEdit processId={processId} note={note} />,
    },
    subscriptions: {
      columnType: ColumnType.DATA,
      label: t('subscriptions'),
      width: '425px',
      renderData: (value, { processId }) => (
        <WfoProcessListSubscriptionsCell
          subscriptions={getSubscriptions(value)}
          numberOfSubscriptionsToRender={1}
          onMoreSubscriptionsClick={() => router.push(`${PATH_WORKFLOWS}/${processId}`)}
        />
      ),
      renderDetails: (value) => <WfoProcessListSubscriptionsCell subscriptions={getSubscriptions(value)} />,
      renderTooltip: (value) =>
        getSubscriptions(value).map(({ description, subscriptionId }) => <p key={subscriptionId}>- {description}</p>),
      clipboardText: (value) =>
        getSubscriptions(value)
          .map(({ subscriptionId }) => subscriptionId)
          .join(', '),
    },
    createdBy: {
      columnType: ColumnType.DATA,
      searchPath: 'process.created_by',
      label: t('createdBy'),
      width: '100px',
    },
    assignee: {
      columnType: ColumnType.DATA,
      searchPath: 'process.assignee',
      label: t('assignee'),
      width: '100px',
    },
    processId: {
      columnType: ColumnType.DATA,
      searchPath: 'process.process_id',
      label: t('processId'),
      width: '90px',
      renderData: (value) => <WfoFirstPartUUID UUID={value} />,
      renderDetails: (value) => value,
      renderTooltip: (value) => value,
    },
    startedAt: {
      columnType: ColumnType.DATA,
      searchPath: 'process.started_at',
      label: t('started'),
      width: '100px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (value) => value?.toString(),
    },
    lastModifiedAt: {
      columnType: ColumnType.DATA,
      searchPath: 'process.last_modified_at',
      label: t('lastModified'),
      width: '125px',
      renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
      renderDetails: parseDateToLocaleDateTimeString,
      clipboardText: parseDateToLocaleDateTimeString,
      renderTooltip: (value) => value?.toString(),
    },
  };

  const searchPathToProperty = getSearchPathToPropertyMap<ProcessListItem>(defaultTableColumns);

  // The search payload is derived entirely from the committed search state, which lives in the URL
  // (queryString and filterString params). Changing any of these values (whether via the UI or a
  // browser back/forward that updates the URL) produces a new payload and RTK Query re-runs the search.
  // RTK Query keys the request on the serialized payload, so it needs no memoization.
  const searchPayload: ProcessListSearchPayload = {
    ...buildGraphqlSearchPayload<ProcessListItem>({
      searchPathToProperty,
      alwaysRequestedProperties: ALWAYS_REQUESTED_PROPERTIES,
      hiddenColumns,
      dataSorting,
      query: committedQueryString,
      pageSize,
      retrieverType,
      filters: buildTabAndUserFilters(isTask, statuses, committedRuleGroup),
      cursor,
    }),
    includeSubscriptions: !hiddenColumns.includes('subscriptions'),
  };

  const { data, error, isFetching } = useGetProcessListSearchQuery(searchPayload);

  useEffect(() => {
    const storedConfig = getStoredTableConfig();
    if (storedConfig) {
      setTableDefaults(storedConfig);
      initPageSize(storedConfig.selectedPageSize);
    }
  }, [getStoredTableConfig, initPageSize]);

  // A tab starts on its first page
  useEffect(() => {
    resetPageCursor();
  }, [isTask, statuses, resetPageCursor]);

  const tableColumns =
    overrideDefaultTableColumns ? overrideDefaultTableColumns(defaultTableColumns) : defaultTableColumns;

  const sortableAndFilterableFieldNames = [...searchPathToProperty.values()].map(String);
  const isSortingAllowed = queryString === '';
  const tableConfig = mapSortableAndFilterableValuesToTableColumnConfig<ProcessListItem>(
    tableColumns,
    isSortingAllowed ? sortableAndFilterableFieldNames : [],
    sortableAndFilterableFieldNames,
  );

  const processListItems = data && !isSearchBlocked ? getItemsFromGraphqlResponse(data) : [];
  const totalItems = !isSearchBlocked && (data?.pageInfo?.totalItems || false);
  const hasNextPage = !isSearchBlocked && (data?.pageInfo?.hasNextPage ?? false);
  const nextPageCursor = data?.nextPageCursor ?? undefined;

  const { exportData, isExporting } = useSearchExport<ProcessListItem>({
    entityKind: EntityKind.PROCESS,
    searchPathToProperty,
    tableColumnConfig: defaultTableColumns,
    fileName: 'Processes',
  });

  const onShowMore = () => {
    if (!isFetching) {
      showNextPage(nextPageCursor);
    }
  };

  const additionalHiddenColumns: TableColumnKeys<ProcessListItem> =
    // only show 'score' when there is an active query or filter
    committedQueryString || committedFilterString ? [] : ['score'];

  // We manually show/hide the score column and shouldn't be configurable by the user.
  const nonEditableColumns: TableColumnKeys<ProcessListItem> = ['score'];

  return (
    <WfoStructuredSearchTable<ProcessListItem>
      entityKind={EntityKind.PROCESS}
      data={processListItems}
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
  );
};
