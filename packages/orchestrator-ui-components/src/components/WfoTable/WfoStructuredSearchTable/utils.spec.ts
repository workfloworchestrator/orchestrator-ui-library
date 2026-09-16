import type { RuleGroupType, RuleType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder';

import { collectRuleFields, hasNestedRuleWithEmptyValue, parseCelToRuleGroup } from './utils';

describe('parseCelToRuleGroup', () => {
  it('assigns ids to the parsed group and rules so rule identity stays stable', () => {
    const ruleGroup = parseCelToRuleGroup('lldp == true && port.speed > 1000');

    expect(ruleGroup?.id).toBeTruthy();
    expect(ruleGroup?.rules).toHaveLength(2);
    ruleGroup?.rules.forEach((rule) => {
      expect((rule as RuleType).id).toBeTruthy();
    });
  });

  it('returns undefined for strings that do not parse to rules', () => {
    expect(parseCelToRuleGroup('')).toBeUndefined();
    expect(parseCelToRuleGroup('not valid cel ===')).toBeUndefined();
  });

  it('drops the field value source parseCEL assigns to bare identifiers, keeping values quoted', () => {
    // parseCEL reads the bare identifier as a field reference (valueSource 'field').
    // Left in place, formatQuery would render the value unquoted: `lldp == fals`.
    const ruleGroup = parseCelToRuleGroup('lldp == fals');

    expect(ruleGroup).toBeDefined();
    expect((ruleGroup?.rules[0] as RuleType).valueSource).toBeUndefined();
    expect(formatQuery(ruleGroup as RuleGroupType, { format: 'cel', fallbackExpression: '' })).toBe('lldp == "fals"');
  });
});

describe('collectRuleFields', () => {
  it('collects unique fields from rules, including nested groups', () => {
    const ruleGroup: RuleGroupType = {
      combinator: 'and',
      rules: [
        { field: 'lldp', operator: '=', value: true },
        { field: 'subscription.status', operator: '=', value: 'active' },
        {
          combinator: 'or',
          rules: [
            { field: 'lldp', operator: '=', value: false },
            { field: 'port.speed', operator: '>', value: 1000 },
          ],
        },
      ],
    };

    expect(collectRuleFields(ruleGroup)).toEqual(['lldp', 'subscription.status', 'port.speed']);
  });

  it('returns an empty list for a group without rules', () => {
    expect(collectRuleFields({ combinator: 'and', rules: [] })).toEqual([]);
  });
});

describe('hasRuleWithEmptyValue', () => {
  const groupWith = (rules: RuleGroupType['rules']): RuleGroupType => ({ combinator: 'and', rules });

  it('reports an empty text value, including whitespace only', () => {
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'subscription.status', operator: '=', value: '' }]))).toBe(
      true,
    );
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'subscription.status', operator: '=', value: '  ' }]))).toBe(
      true,
    );
    expect(
      hasNestedRuleWithEmptyValue(groupWith([{ field: 'subscription.status', operator: '=', value: 'active' }])),
    ).toBe(false);
  });

  it('treats a missing value as empty and a committed boolean or number as filled', () => {
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'lldp', operator: '=', value: undefined }]))).toBe(true);
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'lldp', operator: '=', value: false }]))).toBe(false);
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'port.speed', operator: '>', value: 0 }]))).toBe(false);
  });

  it('reports a range with only one side filled in', () => {
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'port.speed', operator: 'between', value: '1000,' }]))).toBe(
      true,
    );
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'port.speed', operator: 'between', value: '1000' }]))).toBe(
      true,
    );
    expect(
      hasNestedRuleWithEmptyValue(groupWith([{ field: 'port.speed', operator: 'between', value: '1000,2000' }])),
    ).toBe(false);
  });

  it('never reports operators that take no value, whatever their leftover value is', () => {
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'port', operator: 'notNull', value: null }]))).toBe(false);
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'port', operator: 'null', value: null }]))).toBe(false);
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'port', operator: 'notNull', value: '' }]))).toBe(false);
    expect(hasNestedRuleWithEmptyValue(groupWith([{ field: 'port', operator: 'null', value: 'abc' }]))).toBe(false);
  });

  it('does not hold back a search for a filter restored from CEL that uses has component', () => {
    expect(hasNestedRuleWithEmptyValue(parseCelToRuleGroup('subscription.port != null'))).toBe(false);
    expect(hasNestedRuleWithEmptyValue(parseCelToRuleGroup('subscription.port == null'))).toBe(false);
  });

  it('looks inside nested groups', () => {
    const ruleGroup = groupWith([
      { field: 'subscription.status', operator: '=', value: 'active' },
      groupWith([{ field: 'subscription.note', operator: 'contains', value: '' }]),
    ]);

    expect(hasNestedRuleWithEmptyValue(ruleGroup)).toBe(true);
  });

  it('returns false without a rule group', () => {
    expect(hasNestedRuleWithEmptyValue(undefined)).toBe(false);
  });
});
