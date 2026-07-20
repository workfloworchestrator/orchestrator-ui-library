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
  const rulePath = ruleGroupProps.path;
  const isRootGroup: boolean = !rulePath || rulePath.length === 0;

  const {
    ruleGroupContainerBlueStyles,
    ruleGroupContainerWhiteStyles,
    innerGroupContainerWhiteStyles,
    innerGroupContainerBlueStyles,
    ruleGroupBodyGridStyles,
  } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const getGroupContainerStyles = () => {
    if (ruleGroupProps.path.length % 2) {
      return !isRootGroup ? innerGroupContainerWhiteStyles : ruleGroupContainerWhiteStyles;
    } else {
      return !isRootGroup ? innerGroupContainerBlueStyles : ruleGroupContainerBlueStyles;
    }
  };

  const { addRule, path, schema, disabled, ruleGroup, addGroup } = ruleGroupProps;

  return (
    <EuiFlexGroup gutterSize={'none'} responsive={false} alignItems="center">
      <EuiFlexItem>
        <EuiFlexGroup direction="column" css={getGroupContainerStyles()}>
          <EuiFlexItem>
            <EuiFlexGroup gutterSize="none">
              <RuleGroupHeaderComponents {...ruleGroupProps} />
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>
            <div css={ruleGroupBodyGridStyles}>
              <RuleGroupBodyComponents {...ruleGroupProps} />
            </div>
          </EuiFlexItem>
          <EuiFlexItem>
            <WfoAddRuleAction
              handleOnClick={addRule}
              path={path}
              level={path.length}
              schema={schema}
              disabled={disabled ?? false}
              ruleOrGroup={ruleGroup}
              rules={ruleGroup.rules}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <WfoAddGroupAction
              handleOnClick={addGroup}
              path={path}
              level={path.length}
              schema={schema}
              disabled={disabled ?? false}
              ruleOrGroup={ruleGroup}
              rules={ruleGroup.rules}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      {!isRootGroup && <WfoRemoveGroupAction onClick={ruleGroupProps.removeGroup} />}
    </EuiFlexGroup>
  );
};
