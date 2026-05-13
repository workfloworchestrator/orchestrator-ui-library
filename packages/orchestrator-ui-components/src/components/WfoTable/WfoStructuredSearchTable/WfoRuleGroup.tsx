import React from 'react';
import type { RuleGroupProps } from 'react-querybuilder';
import { RuleGroupBodyComponents, RuleGroupHeaderComponents, useRuleGroup } from 'react-querybuilder';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export const WfoRuleGroup = (props: RuleGroupProps) => {
  const ruleGroupProps = useRuleGroup(props);
  const { ruleGroupContainerStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  return (
    <EuiFlexGroup direction="column" gutterSize="s" css={ruleGroupContainerStyles}>
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
