import type { RuleGroupType, RuleType } from 'react-querybuilder';

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
