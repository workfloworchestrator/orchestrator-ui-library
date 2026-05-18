import React, { useRef, useState } from 'react';
import { FullOperator, QueryBuilder, type RuleGroupType } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiTextArea } from '@elastic/eui';

import { WfoTextAnchor } from '@/components';
import { WfoCombinatorSelector } from '@/components/WfoTable/WfoStructuredSearchTable/WfoCombinatorSelector';
import { useWithOrchestratorTheme } from '@/hooks';
import { OperatorDisplay, PathInfo } from '@/types';

import { WfoAddGroupAction } from './WfoAddGroupAction';
import { WfoAddRuleAction } from './WfoAddRuleAction';
import { WfoFieldSelector } from './WfoFieldSelector';
import { WfoOperatorSelector } from './WfoOperatorSelector';
import { WfoRemoveGroupAction } from './WfoRemoveGroupAction';
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
  like: { symbol: '', description: 'contains' },
};

/* TODO: Add the missing operators
['has_component', 'not_has_component'];
 */
type FieldPathInfoMap = Map<string, PathInfo>;

interface WfoFilterBuilderProps {
  filterString?: string;
  onUpdateFilterString: (filterString: string) => void;
  isValidFilterString?: boolean;
  queryBuilderRuleGroup?: RuleGroupType;
  onUpdateQueryBuilder: (ruleGroup: RuleGroupType) => void;
  handleSearch: () => void;
}
const emtpyRuleGroup: RuleGroupType = {
  id: 'root',
  rules: [],
  combinator: 'and',
};

export const WfoFilterBuilder = ({
  filterString,
  onUpdateFilterString,
  isValidFilterString = true,
  queryBuilderRuleGroup = emtpyRuleGroup,
  onUpdateQueryBuilder,
  handleSearch,
}: WfoFilterBuilderProps) => {
  const getOperatorsFromPathInfo = (fieldInfo?: PathInfo): FullOperator[] => {
    return (fieldInfo?.operators ?? []).map((operator) => {
      const { symbol, description } = OPERATOR_MAP[operator] || { symbol: operator, description: operator };
      const rqbOperator = SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP[operator] ?? operator;
      return { name: rqbOperator, label: `${symbol} ${description}`, value: rqbOperator };
    });
  };

  const t = useTranslations('common');
  const { queryBuilderContainerStyles, toggleButtonStyles, textAreaStyles } = useWithOrchestratorTheme(
    getWfoStructuredSearchTableStyles,
  );
  const [isFilterBuilderVisible, setIsFilterBuilderVisible] = useState<boolean>(false);
  const [fieldPathInfoMap, setFieldPathInfoMap] = useState<FieldPathInfoMap>(new Map());
  const isInitialRender = useRef(true);

  const handleFieldSelected = (field: string, pathInfo: PathInfo | undefined) => {
    if (pathInfo) {
      setFieldPathInfoMap((previousMap) => {
        return new Map(previousMap).set(field, pathInfo);
      });
    }
  };

  return (
    <EuiFlexGroup css={queryBuilderContainerStyles}>
      {(isFilterBuilderVisible && (
        <EuiFlexGroup direction={'column'}>
          <EuiFlexItem>
            <QueryBuilder
              query={queryBuilderRuleGroup}
              onQueryChange={(ruleGroup: RuleGroupType) => {
                if (isInitialRender.current) {
                  // this prevents the textarea from displaying '1==1' on initial render
                  isInitialRender.current = false;
                  return;
                }
                onUpdateQueryBuilder(ruleGroup);
              }}
              context={{ onFieldSelected: handleFieldSelected, fieldPathInfoMap }}
              getOperators={(field) => {
                const pathInfo = fieldPathInfoMap.get(field);
                return getOperatorsFromPathInfo(pathInfo);
              }}
              controlElements={{
                fieldSelector: WfoFieldSelector,
                operatorSelector: WfoOperatorSelector,
                valueEditor: WfoValueEditor,
                ruleGroup: WfoRuleGroup,
                rule: WfoRule,
                combinatorSelector: WfoCombinatorSelector,
                addRuleAction: WfoAddRuleAction,
                addGroupAction: WfoAddGroupAction,
                removeGroupAction: WfoRemoveGroupAction,
                removeRuleAction: WfoRemoveRuleAction,
              }}
              maxLevels={5}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiTextArea
              css={textAreaStyles}
              id={'searchbox-textarea'}
              value={filterString}
              onChange={(e) => {
                const filterString = e.target.value;
                onUpdateFilterString(filterString);
              }}
              fullWidth={true}
              isClearable={true}
              resize={'vertical'}
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
                onUpdateFilterString('');
                setIsFilterBuilderVisible(false);
              }}
            />
          </EuiFlexGroup>
        </EuiFlexGroup>
      )) || (
        <EuiButton
          css={toggleButtonStyles}
          onClick={() => setIsFilterBuilderVisible(true)}
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
