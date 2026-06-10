import React from 'react';
import type { RuleGroupProps } from 'react-querybuilder';
import { RuleGroupBodyComponents, RuleGroupHeaderComponents, useRuleGroup } from 'react-querybuilder';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

import { WfoAddGroupAction } from './WfoAddGroupAction';
import { WfoAddRuleAction } from './WfoAddRuleAction';
import { WfoRemoveGroupAction } from './WfoRemoveGroupAction';

export const WfoRuleGroup = (props: RuleGroupProps) => {
  const ruleGroupProps = useRuleGroup(props);
  const ruleId = ruleGroupProps.ruleGroup.id;

  const {
    ruleGroupContainerBlueStyles,
    ruleGroupContainerWhiteStyles,
    innerGroupContainerWhiteStyles,
    innerGroupContainerBlueStyles,
  } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const getGroupContainerStyles = () => {
    if (ruleGroupProps.path.length % 2) {
      return ruleId !== 'root' ? innerGroupContainerWhiteStyles : ruleGroupContainerWhiteStyles;
    } else {
      return ruleId !== 'root' ? innerGroupContainerBlueStyles : ruleGroupContainerBlueStyles;
    }
  };

  return (
    <EuiFlexGroup gutterSize={'none'} alignItems="center">
      <EuiFlexItem>
        <EuiFlexGroup direction="column" gutterSize="s" css={getGroupContainerStyles()}>
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
      </EuiFlexItem>
      {ruleId !== 'root' && <WfoRemoveGroupAction onClick={ruleGroupProps.removeGroup} />}
    </EuiFlexGroup>
  );
};
