import type { RuleGroupType } from 'react-querybuilder';
import { prepareRuleGroup } from 'react-querybuilder';
import { parseCEL } from 'react-querybuilder/parseCEL';

/** Collects the unique field names used by the rules of a rule group, including nested groups. */
export const collectRuleFields = (ruleGroup: RuleGroupType): string[] => {
  const fields = ruleGroup.rules.flatMap((rule) =>
    typeof rule !== 'string' && 'rules' in rule ? collectRuleFields(rule)
    : typeof rule !== 'string' ? [rule.field]
    : [],
  );
  return [...new Set(fields)];
};

export const parseCelToRuleGroup = (celString: string): RuleGroupType | undefined => {
  if (!celString) {
    return undefined;
  }
  try {
    const ruleGroup = parseCEL(celString);
    // prepareRuleGroup assigns the rule ids parseCEL leaves out. Without stable ids the
    // QueryBuilder regenerates them on every query prop change, remounting all rules —
    // which loses editor state and can loop with editors that commit a value on mount.
    return ruleGroup?.rules?.length > 0 ? prepareRuleGroup(ruleGroup) : undefined;
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
