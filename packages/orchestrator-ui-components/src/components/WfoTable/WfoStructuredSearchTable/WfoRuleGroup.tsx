import React from 'react';
import type { RuleGroupProps } from 'react-querybuilder';
import { RuleGroupBodyComponents, RuleGroupHeaderComponents, useRuleGroup } from 'react-querybuilder';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

import { WfoAddGroupAction } from './WfoAddGroupAction';
import { WfoAddRuleAction } from './WfoAddRuleAction';

export const WfoRuleGroup = (props: RuleGroupProps) => {
  const ruleGroupProps = useRuleGroup(props);
  const { ruleGroupContainerBlueStyles, ruleGroupContainerWhiteStyles } = useWithOrchestratorTheme(
    getWfoStructuredSearchTableStyles,
  );

  return (
    <EuiFlexGroup
      direction="column"
      gutterSize="s"
      css={ruleGroupProps.path.length % 2 ? ruleGroupContainerWhiteStyles : ruleGroupContainerBlueStyles}
    >
      <EuiFlexItem>
        <EuiFlexGroup gutterSize="none">
          <RuleGroupHeaderComponents {...ruleGroupProps} />
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <RuleGroupBodyComponents {...ruleGroupProps} />
      </EuiFlexItem>
      <EuiFlexItem>
        <WfoAddRuleAction
          handleOnClick={ruleGroupProps.addRule}
          path={ruleGroupProps.path}
          level={ruleGroupProps.path.length}
          schema={ruleGroupProps.schema}
          disabled={ruleGroupProps.disabled ?? false}
          ruleOrGroup={ruleGroupProps.ruleGroup}
          rules={ruleGroupProps.ruleGroup.rules}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <WfoAddGroupAction
          handleOnClick={ruleGroupProps.addGroup}
          path={ruleGroupProps.path}
          level={ruleGroupProps.path.length}
          schema={ruleGroupProps.schema}
          disabled={ruleGroupProps.disabled ?? false}
          ruleOrGroup={ruleGroupProps.ruleGroup}
          rules={ruleGroupProps.ruleGroup.rules}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
