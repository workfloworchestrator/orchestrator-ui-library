import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';

import { EntityKind, Filter, MatchingField, QueryCombinator, QueryOperator, SubscriptionStatus } from '@/types';

import { WfoFilterTab } from '../../components';

export enum WfoSubscriptionListTab {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  TRANSIENT = 'TRANSIENT',
  ALL = 'ALL',
}

export const subscriptionListTabs: WfoFilterTab<WfoSubscriptionListTab>[] = [
  {
    id: WfoSubscriptionListTab.ACTIVE,
    translationKey: 'active',
  },
  {
    id: WfoSubscriptionListTab.TERMINATED,
    translationKey: 'terminated',
  },
  {
    id: WfoSubscriptionListTab.TRANSIENT,
    translationKey: 'transient',
  },
  {
    id: WfoSubscriptionListTab.ALL,
    translationKey: 'all',
  },
];

export const parseRuleGroupToFilters = (ruleGroup?: RuleGroupType) => {
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
    combinator: QueryCombinator.OR,
    rules: getSubscriptionStatusesFromTab(tab).map((status) => ({
      field: 'subscription.status',
      operator: QueryOperator.EQUALS,
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
 * reports every matched filter in matchingFields, so those implicit matches are removed here to
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
    ruleGroups.length === 1 ? ruleGroups[0] : { combinator: QueryCombinator.AND, rules: ruleGroups };

  return parseRuleGroupToFilters(combinedRuleGroup);
};
