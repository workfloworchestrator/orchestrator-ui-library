import React from 'react';
import type { RuleGroupProps } from 'react-querybuilder';
import { RuleGroupBodyComponents, RuleGroupHeaderComponents, useRuleGroup } from 'react-querybuilder';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

export const WfoRuleGroup = (props: RuleGroupProps) => {
  const ruleGroupProps = useRuleGroup(props);

  return (
    <EuiFlexGroup direction="column" gutterSize="s">
      <EuiFlexItem>
        <EuiFlexGroup gutterSize="none">
          <RuleGroupHeaderComponents {...ruleGroupProps} />
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <RuleGroupBodyComponents {...ruleGroupProps} />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
