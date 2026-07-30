import type { RuleGroupType, RuleType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder';

import { collectRuleFields, parseCelToRuleGroup } from './utils';

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
