import { type KeyboardEventHandler, useEffect, useRef } from 'react';
import { FullOperator, RuleGroupType, RuleType, generateID } from 'react-querybuilder';
import { prepareRuleGroup } from 'react-querybuilder';
import { parseCEL } from 'react-querybuilder/parseCEL';

import { useDebouncedCallback, useFieldsPathInfo } from '@/hooks';
import { EntityKind, OPERATOR_MAP, OperatorDescription } from '@/types';

export const FILTER_CHANGE_DEBOUNCE_DELAY = 1000;

interface SearchWithDebouncedCallbackProps {
  filterString?: string;
  isValidFilterString: boolean;
  hasEmptyRuleValue?: boolean;
  searchCallback: () => void;
}

export const useSearchWithDebouncedCallback = ({
  filterString,
  isValidFilterString,
  hasEmptyRuleValue = false,
  searchCallback,
}: SearchWithDebouncedCallbackProps) => {
  const {
    trigger: triggerSearch,
    cancel: cancelSearch,
    pendingRun: pendingSearchRun,
  } = useDebouncedCallback(searchCallback);
  const lastFilterStringRef = useRef(filterString);

  const handleSubmitSearchOnClick = () => {
    if (!isValidFilterString) return;
    triggerSearch();
    return;
  };

  useEffect(() => {
    const hasFilterStringChanged = filterString !== lastFilterStringRef.current;
    lastFilterStringRef.current = filterString;

    if (!hasFilterStringChanged) return;

    if (isValidFilterString && !hasEmptyRuleValue) {
      triggerSearch(FILTER_CHANGE_DEBOUNCE_DELAY);
    } else {
      cancelSearch();
    }
  }, [filterString, isValidFilterString, hasEmptyRuleValue, triggerSearch, cancelSearch]);

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
 * Returns buildColumnFilter, which builds a CEL filter appending a single column condition to the
 * current filter, together with its parsed rule group. The path info of the table's columns is loaded
 * up front, so a column search can use contains for the fields that offer it. The column name is
 * resolved via getColumnSearchFieldName, falling back to the field key. buildColumnFilter returns
 * undefined when the input can't produce a valid filter (empty/quoted search text, or a filter that
 * doesn't parse back to rules).
 */
export const useBuildColumnFilter = <T>(
  tableColumnConfig: object,
  getColumnSearchFieldName?: (field: keyof T) => string,
) => {
  const columnsPathInfo = useFieldsPathInfo(
    (Object.keys(tableColumnConfig) as (keyof T)[]).map((field) => getColumnSearchFieldName?.(field) ?? String(field)),
    EntityKind.SUBSCRIPTION,
  );

  const buildColumnFilter = (
    field: keyof T,
    searchText: string,
    currentFilter?: string,
  ): { filterString: string; ruleGroup: RuleGroupType } | undefined => {
    // A double quote in the value would break the `"..."` CEL literal and parseCEL has no escaping.
    if (!searchText || searchText.includes('"')) {
      return undefined;
    }

    const searchFieldName = getColumnSearchFieldName?.(field) ?? String(field);
    const fieldHasLikeOperator = !!columnsPathInfo.get(searchFieldName)?.operators.includes('like');
    const columnFilterCondition =
      fieldHasLikeOperator ? `${searchFieldName}.contains("${searchText}")` : `${searchFieldName} == "${searchText}"`;
    const trimmedCurrentFilter = currentFilter?.trim();
    const filterString =
      trimmedCurrentFilter ? `(${trimmedCurrentFilter}) && ${columnFilterCondition}` : columnFilterCondition;

    const ruleGroup = parseCelToRuleGroup(filterString);
    if (!ruleGroup) {
      return undefined;
    }

    return { filterString, ruleGroup };
  };

  return { buildColumnFilter };
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
  like: OperatorDescription.CONTAINS,
  not_regexp: 'doesNotContain',
  has_component: 'notNull',
  not_has_component: 'null',
};

// Operators without a value; marking them unary makes react-querybuilder's Rule hide the value editor.
const RQB_UNARY_OPERATORS = ['null', 'notNull'];

const isEmptyValue = (rule: RuleType): boolean => {
  const { value } = rule;
  if (RQB_UNARY_OPERATORS.includes(rule.operator)) {
    return false;
  } else if (typeof value !== 'string') {
    return value === undefined || value === null;
  } else if (rule.operator === 'between') {
    const rangeParts = value.split(',');
    return rangeParts.length < 2 || rangeParts.some((rangePart) => rangePart.trim() === '');
  }
  return value.trim() === '';
};

/** True when any rule of the group, nested groups included, has an empty value editor. */
export const hasNestedRuleWithEmptyValue = (ruleGroup?: RuleGroupType): boolean =>
  !!ruleGroup?.rules.some((rule) => {
    if (typeof rule === 'string') {
      return false;
    }
    return 'rules' in rule ? hasNestedRuleWithEmptyValue(rule) : isEmptyValue(rule);
  });

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
