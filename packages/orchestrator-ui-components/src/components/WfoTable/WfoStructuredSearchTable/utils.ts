import { type KeyboardEventHandler, useEffect, useRef } from 'react';
import { FullOperator, RuleGroupType, generateID } from 'react-querybuilder';
import { prepareRuleGroup } from 'react-querybuilder';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useDebouncedCallback } from '@/hooks';
import { OperatorDisplay } from '@/types';

export const FILTER_CHANGE_DEBOUNCE_DELAY = 1000;

interface SearchWithDebouncedCallbackProps {
  filterString?: string;
  isValidFilterString: boolean;
  searchCallback: () => void;
}

export const useSearchWithDebouncedCallback = ({
  filterString,
  isValidFilterString,
  searchCallback,
}: SearchWithDebouncedCallbackProps) => {
  const { trigger: triggerSearch, pendingRun: pendingSearchRun } = useDebouncedCallback(searchCallback);
  const lastFilterStringRef = useRef(filterString);

  const handleSubmitSearchOnClick = () => {
    if (!isValidFilterString) return;
    triggerSearch();
    return;
  };

  useEffect(() => {
    const hasFilterStringChanged = filterString !== lastFilterStringRef.current;
    lastFilterStringRef.current = filterString;

    if (hasFilterStringChanged && isValidFilterString) {
      triggerSearch(FILTER_CHANGE_DEBOUNCE_DELAY);
    }
  }, [filterString, isValidFilterString, triggerSearch]);

  // Enter applies the filter exactly like that button; Shift+Enter is left alone so it can
  // insert a newline in a textarea.
  const handleSubmitSearchOnEnter: KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    handleSubmitSearchOnClick();
  };

  return { handleSubmitSearchOnClick, pendingSearchRun, handleSubmitSearchOnEnter };
};

/** Collects the unique field names used by the rules of a rule group, including nested groups. */
export const collectRuleFields = (ruleGroup: RuleGroupType): string[] => {
  const fields = ruleGroup.rules.flatMap((rule) => {
    if (typeof rule === 'string') {
      return [];
    }
    if ('rules' in rule) {
      return collectRuleFields(rule);
    }
    return [rule.field];
  });
  return [...new Set(fields)];
};

// The filter builder has no field-to-field comparisons: a 'field' value source only
// appears when parseCEL reads a bare identifier (e.g. the half-typed literal in
// `lldp == fals`) as a field reference. If it stays on the rule it survives later field
// and value edits (resetOnFieldChange is off and the value editors only set the value),
// and formatQuery renders the value of such a rule unquoted — producing invalid CEL like
// `subscription.end_date == 2026-07-05T22:00:00.000Z` once a string value is committed.
const dropFieldValueSources = (ruleGroup: RuleGroupType): RuleGroupType => ({
  ...ruleGroup,
  rules: ruleGroup.rules.map((rule) => {
    if (typeof rule === 'string' || 'rules' in rule) {
      return typeof rule === 'string' ? rule : dropFieldValueSources(rule);
    }
    if (rule.valueSource === 'field') {
      const ruleWithoutValueSource = { ...rule };
      delete ruleWithoutValueSource.valueSource;
      return ruleWithoutValueSource;
    }
    return rule;
  }),
});

export const parseCelToRuleGroup = (celString: string): RuleGroupType | undefined => {
  if (!celString) {
    return undefined;
  }
  try {
    const ruleGroup = parseCEL(celString);
    // prepareRuleGroup assigns the rule ids parseCEL leaves out. Without stable ids the
    // QueryBuilder regenerates them on every query prop change, remounting all rules —
    // which loses editor state and can loop with editors that commit a value on mount.
    return ruleGroup?.rules?.length > 0 ? prepareRuleGroup(dropFieldValueSources(ruleGroup)) : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Builds a CEL filter that appends a single column condition (`field == "value"`) to the current
 * filter and returns it together with its parsed rule group. The column name is resolved via
 * getColumnSearchFieldName, falling back to the field key. Returns undefined when the input can't
 * produce a valid filter (empty/quoted search text, or a filter that doesn't parse back to rules).
 */
export const buildColumnFilter = <T>(
  field: keyof T,
  searchText: string,
  currentFilter?: string,
  getColumnSearchFieldName?: (field: keyof T) => string,
): { filterString: string; ruleGroup: RuleGroupType } | undefined => {
  // A double quote in the value would break the `== "..."` CEL literal and parseCEL has no escaping.
  if (!searchText || searchText.includes('"')) {
    return undefined;
  }

  const searchFieldName = getColumnSearchFieldName?.(field) ?? String(field);
  const columnFilterCondition = `${searchFieldName} == "${searchText}"`;
  const trimmedCurrentFilter = currentFilter?.trim();
  const filterString =
    trimmedCurrentFilter ? `(${trimmedCurrentFilter}) && ${columnFilterCondition}` : columnFilterCondition;

  const ruleGroup = parseCelToRuleGroup(filterString);
  if (!ruleGroup) {
    return undefined;
  }

  return { filterString, ruleGroup };
};

// Maps PathInfo operator names to react-querybuilder's native operator names,
// which is what parseCEL produces and formatQuery(cel) expects.
// has_component/not_has_component ride on notNull/null: they survive the CEL round trip
// (`field != null` / `field == null`) and formatQuery(elasticsearch) turns them into
// exists / must_not-exists, which the backend translates to component-presence filters.
const SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP: Record<string, string> = {
  eq: '=',
  neq: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  between: 'between',
  like: 'contains',
  not_regexp: 'doesNotContain',
  has_component: 'notNull',
  not_has_component: 'null',
};

// Operators without a value; marking them unary makes react-querybuilder's Rule hide the value editor.
const RQB_UNARY_OPERATORS = ['null', 'notNull'];

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

export const operatorsToRQBOperatorOptionsMapper = (operators?: string[]): FullOperator[] => {
  return (operators ?? []).map((operator) => {
    const { symbol, description } = OPERATOR_MAP[operator] || { symbol: operator, description: operator };
    const rqbOperator = SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP[operator] ?? operator;
    return {
      name: rqbOperator,
      label: `${symbol} ${description}`,
      value: rqbOperator,
      ...(RQB_UNARY_OPERATORS.includes(rqbOperator) && { arity: 'unary' }),
    };
  });
};

export const onAddGroupHandler = (ruleGroup: RuleGroupType): RuleGroupType => {
  const [firstRule] = ruleGroup.rules;
  return firstRule ? { ...ruleGroup, rules: [...ruleGroup.rules, { ...firstRule, id: generateID() }] } : ruleGroup;
};
