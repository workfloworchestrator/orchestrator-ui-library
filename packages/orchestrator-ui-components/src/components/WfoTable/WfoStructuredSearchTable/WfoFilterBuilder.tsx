import React, { useState } from 'react';
import { FullOperator, QueryBuilder, type RuleGroupType, generateID } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { SearchParams, WfoAutoExpandableTextArea, WfoTextAnchor } from '@/components';
import { WfoCombinatorSelector } from '@/components/WfoTable/WfoStructuredSearchTable/WfoCombinatorSelector';
import { useWithOrchestratorTheme } from '@/hooks';
import { OperatorDisplay } from '@/types';
import type { FieldToOperatorMap } from '@/types';

import { WfoFieldSelector } from './WfoFieldSelector';
import { WfoInlineCombinator } from './WfoInlineCombinator';
import { WfoOperatorSelector } from './WfoOperatorSelector';
import { WfoRemoveRuleAction } from './WfoRemoveRuleAction';
import { WfoRule } from './WfoRule';
import { WfoRuleGroup } from './WfoRuleGroup';
import { WfoValueEditor } from './WfoValueEditor';
import { getWfoStructuredSearchTableStyles } from './styles';

// Maps PathInfo operator names to react-querybuilder's native operator names,
// which is what parseCEL produces and formatQuery(cel) expects.
const SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP: Record<string, string> = {
  eq: '=',
  neq: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  between: 'between',
  like: 'contains',
};

const OPERATOR_MAP: Record<string, OperatorDisplay> = {
  eq: { symbol: '=', description: 'equals' },
  neq: { symbol: '≠', description: 'not equals' },
  lt: { symbol: '<', description: 'less than' },
  lte: { symbol: '≤', description: 'less than or equal to' },
  gt: { symbol: '>', description: 'greater than' },
  gte: { symbol: '≥', description: 'greater than or equal to' },
  between: { symbol: '⟷', description: 'between (range)' },
  has_component: { symbol: '✓', description: 'has component' },
  not_has_component: { symbol: '✗', description: 'does not have component' },
  like: { symbol: '∋', description: 'contains' },
};

/* TODO: Add the missing operators
['has_component', 'not_has_component'];
 */

interface WfoFilterBuilderProps {
  filterString?: string;
  onUpdateFilterString: (filterString: string) => void;
  isValidFilterString?: boolean;
  queryBuilderRuleGroup?: RuleGroupType;
  onUpdateQueryBuilder: (ruleGroup: RuleGroupType | false) => void;
  handleSearch: (searchParams?: SearchParams) => void;
  isFilterBuilderVisible: boolean;
  onToggleFilterBuilder: (isVisible: boolean) => void;
  prefilledFieldOptions: FieldToOperatorMap;
}

const initialRuleGroup: RuleGroupType = {
  id: 'root',
  rules: [{ id: 'rule-0', field: '~', operator: '=', value: '' }],
  combinator: 'and',
};

const onAddGroupHandler = (ruleGroup: RuleGroupType): RuleGroupType => {
  const [firstRule] = ruleGroup.rules;
  return firstRule ? { ...ruleGroup, rules: [...ruleGroup.rules, { ...firstRule, id: generateID() }] } : ruleGroup;
};

export const WfoFilterBuilder = ({
  filterString,
  onUpdateFilterString,
  isValidFilterString = true,
  queryBuilderRuleGroup = initialRuleGroup,
  onUpdateQueryBuilder,
  handleSearch,
  prefilledFieldOptions,
  isFilterBuilderVisible,
  onToggleFilterBuilder,
}: WfoFilterBuilderProps) => {
  const mapOperatorsToRQBOperatorOptions = (operators?: string[]): FullOperator[] => {
    return (operators ?? []).map((operator) => {
      const { symbol, description } = OPERATOR_MAP[operator] || { symbol: operator, description: operator };
      const rqbOperator = SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP[operator] ?? operator;
      return { name: rqbOperator, label: `${symbol} ${description}`, value: rqbOperator };
    });
  };

  const t = useTranslations('common');
  const { queryBuilderContainerStyles, toggleButtonStyles } = useWithOrchestratorTheme(
    getWfoStructuredSearchTableStyles,
  );
  const [fieldToOperatorMap, setFieldToOperatorMap] = useState<FieldToOperatorMap>(prefilledFieldOptions);

  const handleFieldSelected = (field: string, operators: string[]) => {
    setFieldToOperatorMap((previousMap) => {
      return new Map(previousMap).set(field, operators);
    });
  };

  return (
    <EuiFlexGroup css={isFilterBuilderVisible ? queryBuilderContainerStyles : undefined}>
      {(isFilterBuilderVisible && (
        <EuiFlexGroup direction={'column'}>
          <EuiFlexItem>
            <QueryBuilder
              query={queryBuilderRuleGroup}
              enableMountQueryChange={false}
              onQueryChange={(ruleGroup: RuleGroupType) => {
                onUpdateQueryBuilder(ruleGroup);
              }}
              context={{ onFieldSelected: handleFieldSelected, prefilledFieldOptions }}
              getOperators={(field) => {
                const operators = fieldToOperatorMap.get(field);
                return mapOperatorsToRQBOperatorOptions(operators);
              }}
              controlElements={{
                fieldSelector: WfoFieldSelector,
                operatorSelector: WfoOperatorSelector,
                valueEditor: WfoValueEditor,
                ruleGroup: WfoRuleGroup,
                rule: WfoRule,
                combinatorSelector: WfoCombinatorSelector,
                inlineCombinator: WfoInlineCombinator,
                addRuleAction: null,
                addGroupAction: null,
                removeGroupAction: null,
                removeRuleAction: WfoRemoveRuleAction,
              }}
              addRuleToNewGroups
              onAddGroup={onAddGroupHandler}
              maxLevels={5}
              showCombinatorsBetweenRules
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <WfoAutoExpandableTextArea
              id={'searchbox-textarea'}
              value={filterString ?? ''}
              onChange={(e) => {
                const filterString = e.target.value;
                onUpdateFilterString(filterString);
              }}
              isInvalid={!isValidFilterString}
            />
          </EuiFlexItem>

          <EuiFlexGroup direction={'rowReverse'} alignItems={'center'}>
            <EuiButton
              onClick={() => {
                handleSearch();
              }}
              id={'button-apply-filter'}
              data-test-id={'button-apply-filter'}
              fill
              type="submit"
              aria-label={t('applyFilter')}
              disabled={!isValidFilterString}
            >
              {t('applyFilter')}
            </EuiButton>
            <WfoTextAnchor
              text={t('removeFilter')}
              onClick={() => {
                onUpdateQueryBuilder(false);
                // we call with ruleGroup: false explictly to
                // avoid state not having caught up yet when searching
                handleSearch({ ruleGroup: false });
                onToggleFilterBuilder(false);
              }}
            />
          </EuiFlexGroup>
        </EuiFlexGroup>
      )) || (
        <EuiButton
          css={toggleButtonStyles}
          onClick={() => onToggleFilterBuilder(true)}
          id={'button-toggle-filter-builder'}
          data-test-id={'button-toggle-filter-builder'}
          fill
          type="submit"
          iconType="filter"
          iconSide="left"
          aria-label={t('createFilter')}
        >
          {t('createFilter')}
        </EuiButton>
      )}
    </EuiFlexGroup>
  );
};
