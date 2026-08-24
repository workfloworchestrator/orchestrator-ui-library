import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';

import { WfoSubscriptionListTab } from '@/components';
import { SearchPaginationPayload } from '@/rtk';
import {
  Condition,
  EntityKind,
  Filter,
  MatchingField,
  OperatorDisplay,
  PathInfo,
  RetrieverType,
  SearchResult,
  SubscriptionStatus,
} from '@/types';

export function isSubscriptionSearchResult(item: SearchResult): boolean {
  return item.entity_type === 'SUBSCRIPTION';
}

export function isProcessSearchResult(item: SearchResult): boolean {
  return item.entity_type === 'PROCESS';
}

export function isProductSearchResult(item: SearchResult): boolean {
  return item.entity_type === 'PRODUCT';
}

export function isWorkflowSearchResult(item: SearchResult): boolean {
  return item.entity_type === 'WORKFLOW';
}

export const isCondition = (item: Filter | Condition): item is Condition => {
  return 'path' in item && 'condition' in item;
};

const ENDPOINT_PATHS: Record<EntityKind, string> = {
  PROCESS: 'processes',
  PRODUCT: 'products',
  WORKFLOW: 'workflows',
  SUBSCRIPTION: 'subscriptions',
};

export const getEndpointPath = (entityType: EntityKind): string => {
  return ENDPOINT_PATHS[entityType] || ENDPOINT_PATHS.SUBSCRIPTION;
};

export const getDetailUrl = (result: SearchResult, baseUrl: string): string => {
  const endpointPath = getEndpointPath(result.entity_type);
  return `${baseUrl}/${endpointPath}/${result.entity_id}`;
};

export const ENTITY_TABS = [
  { id: EntityKind.SUBSCRIPTION, label: 'Subscriptions' },
  { id: EntityKind.PRODUCT, label: 'Products' },
  { id: EntityKind.WORKFLOW, label: 'Workflows' },
  { id: EntityKind.PROCESS, label: 'Processes' },
];

interface ThemeColors {
  success: string;
  primary: string;
  warning: string;
  accent: string;
  textSubdued: string;
}

interface Theme {
  colors: ThemeColors;
}

const TYPE_COLOR_MAP: Record<string, keyof ThemeColors> = {
  string: 'success',
  number: 'primary',
  boolean: 'warning',
  datetime: 'accent',
  component: 'primary',
};

export const getTypeColor = (type: string, theme: Theme): string => {
  const colorKey = TYPE_COLOR_MAP[type.toLowerCase()];
  return colorKey ? theme.colors[colorKey] : theme.colors.textSubdued;
};

const OPERATOR_MAP: Record<string, OperatorDisplay> = {
  eq: { symbol: '=', description: 'equals' },
  neq: { symbol: '≠', description: 'not equals' },
  lt: { symbol: '<', description: 'less than' },
  lte: { symbol: '≤', description: 'less than or equal to' },
  gt: { symbol: '>', description: 'greater than' },
  gte: { symbol: '≥', description: 'greater than or equal to' },
  between: { symbol: '⟷', description: 'between (range)' },
  has_component: { symbol: '✓', description: 'has component' },
  not_has_component: { symbol: '✗', description: 'does not have component' },
  like: { symbol: '∋', description: 'contains' },
  not_regexp: { symbol: '∌', description: 'does not contain' },
};

const BOOLEAN_OPERATOR_MAP: Record<string, OperatorDisplay> = {
  eq: { symbol: '✓', description: 'is true' },
  neq: { symbol: '✗', description: 'is false' },
};

export const getOperatorDisplay = (op: string, selectedPathInfo?: PathInfo): OperatorDisplay => {
  if (selectedPathInfo?.type === 'boolean' && BOOLEAN_OPERATOR_MAP[op]) {
    return BOOLEAN_OPERATOR_MAP[op];
  }
  return OPERATOR_MAP[op] || { symbol: op, description: op };
};

export const getButtonColor = (op: string, pathInfo: PathInfo | null, condition: Condition): 'primary' | 'text' => {
  if (pathInfo?.type === 'boolean') {
    const isSelected = op === 'eq' ? condition.condition.value === true : condition.condition.value === false;
    return isSelected ? 'primary' : 'text';
  }
  return condition.condition.op === op ? 'primary' : 'text';
};

export const getButtonFill = (op: string, pathInfo: PathInfo | null, condition: Condition): boolean => {
  if (pathInfo?.type === 'boolean') {
    return op === 'eq' ? condition.condition.value === true : condition.condition.value === false;
  }
  return condition.condition.op === op;
};

export const isFilterValid = (group: Filter): boolean => {
  return group.children.every((child) => {
    if (isCondition(child)) {
      return child.path && child.condition.op && child.condition.value !== undefined;
    }
    return isFilterValid(child);
  });
};

interface SearchQuery {
  text?: string;
}

export const buildSearchParams = (
  debouncedQuery: SearchQuery | string,
  selectedEntityTab: EntityKind,
  filterGroup: Filter,
  pageSize: number,
  cursor: number,
  retriever?: Exclude<RetrieverType, 'auto'>,
): SearchPaginationPayload => {
  const queryText = typeof debouncedQuery === 'string' ? debouncedQuery : debouncedQuery?.text?.trim() || '';

  return {
    entity_type: selectedEntityTab,
    query: queryText || '',
    filters: filterGroup?.children.length > 0 ? filterGroup : undefined,
    limit: pageSize,
    retriever,
    cursor,
    response_columns: [],
  };
};

const parseRuleGroupToFilters = (ruleGroup?: RuleGroupType) => {
  const elasticQuery =
    ruleGroup ? formatQuery(ruleGroup, { format: 'elasticsearch', fallbackExpression: '' }) : undefined;
  return elasticQuery as unknown as Filter;
};

const getSubscriptionStatusesFromTab = (tab: WfoSubscriptionListTab) => {
  switch (tab) {
    case WfoSubscriptionListTab.ACTIVE:
      return [SubscriptionStatus.ACTIVE];
    case WfoSubscriptionListTab.TERMINATED:
      return [SubscriptionStatus.TERMINATED];
    case WfoSubscriptionListTab.TRANSIENT:
      return [SubscriptionStatus.INITIAL, SubscriptionStatus.PROVISIONING, SubscriptionStatus.MIGRATING];
    case WfoSubscriptionListTab.ALL:
      return [
        SubscriptionStatus.ACTIVE,
        SubscriptionStatus.TERMINATED,
        SubscriptionStatus.INITIAL,
        SubscriptionStatus.MIGRATING,
        SubscriptionStatus.PROVISIONING,
      ];
    default:
      return [SubscriptionStatus.ACTIVE];
  }
};

const buildSubscriptionStatusFilter = (tab: WfoSubscriptionListTab) => {
  return {
    combinator: 'or',
    rules: getSubscriptionStatusesFromTab(tab).map((status) => ({
      field: 'subscription.status',
      operator: '=',
      value: status,
    })),
  };
};

/**
 * Search-API field path holding the status of each entity kind. Only the SUBSCRIPTION path is in
 * use; the others follow the same convention but should be verified against the backend paths
 * endpoint before relying on them.
 */
const STATUS_FIELD_PATHS: Record<EntityKind, string> = {
  [EntityKind.SUBSCRIPTION]: 'subscription.status',
  [EntityKind.PROCESS]: 'process.last_status',
  [EntityKind.PRODUCT]: 'product.status',
  [EntityKind.WORKFLOW]: 'workflow.status',
};

/**
 * The tab implicitly adds a status filter to the search (see addStatusFilterFromTab). The backend
 * reports every matched filter in matching_fields, so those implicit matches are removed here to
 * only show the user matches for filters they provided themselves. Matching on path AND value:
 * a status match that cannot come from the tab filter is kept.
 */
export const removeTabStatusMatchingFields = (
  matchingFields: MatchingField[] | null | undefined,
  tab: WfoSubscriptionListTab,
  entityKind: EntityKind,
): MatchingField[] => {
  const statusFieldPath = STATUS_FIELD_PATHS[entityKind];
  const tabStatuses = getSubscriptionStatusesFromTab(tab);
  return (
    matchingFields?.filter((field) => {
      const isTabStatusMatch =
        field.path === statusFieldPath
        && tabStatuses.some((status) => status.toLowerCase() === field.text.toLowerCase());
      return !isTabStatusMatch;
    }) ?? []
  );
};

export const addStatusFilterFromTab = (ruleGroup: RuleGroupType | false | undefined, tab: WfoSubscriptionListTab) => {
  const userRuleGroup = ruleGroup === false ? undefined : ruleGroup;
  const ruleGroups = [buildSubscriptionStatusFilter(tab), userRuleGroup].filter(Boolean) as RuleGroupType[];

  const combinedRuleGroup: RuleGroupType =
    ruleGroups.length === 1 ? ruleGroups[0] : { combinator: 'and', rules: ruleGroups };

  return parseRuleGroupToFilters(combinedRuleGroup);
};
