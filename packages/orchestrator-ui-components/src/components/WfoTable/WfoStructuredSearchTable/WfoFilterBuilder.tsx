import React, { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import {
  type FieldSelectorProps,
  FullOperator,
  QueryBuilder,
  type RuleGroupType,
  generateID,
} from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { SearchParams, WfoAutoExpandableTextArea, WfoTextAnchor } from '@/components';
import { WfoCombinatorSelector } from '@/components/WfoTable/WfoStructuredSearchTable/WfoCombinatorSelector';
import { useFieldsPathInfo, useWithOrchestratorTheme } from '@/hooks';
import { EntityKind, OperatorDisplay } from '@/types';
import type { FieldToOperatorMap, PathInfo, WfoQueryBuilderContext } from '@/types';

import { WfoFieldSelector } from './WfoFieldSelector';
import { WfoInlineCombinator } from './WfoInlineCombinator';
import { WfoOperatorSelector } from './WfoOperatorSelector';
import { WfoRemoveRuleAction } from './WfoRemoveRuleAction';
import { WfoRule } from './WfoRule';
import { WfoRuleGroup } from './WfoRuleGroup';
import { WfoValueEditor } from './WfoValueEditor';
import { getWfoStructuredSearchTableStyles } from './styles';
import { collectRuleFields } from './utils';

// Maps PathInfo operator names to react-querybuilder's native operator names,
// which is what parseCEL produces and formatQuery(cel) expects.
// has_component/not_has_component ride on notNull/null: they survive the CEL round trip
// (`field != null` / `field == null`) and formatQuery(elasticsearch) turns them into
// exists / must_not-exists, which the backend translates to component-presence filters.
const SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP: Record<string, string> = {
  eq: '=',
  neq: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  between: 'between',
  like: 'contains',
  has_component: 'notNull',
  not_has_component: 'null',
};

// Operators without a value; marking them unary makes react-querybuilder's Rule hide the value editor.
const RQB_UNARY_OPERATORS = ['null', 'notNull'];

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

interface WfoFilterBuilderProps {
  filterString?: string;
  onUpdateFilterString: (filterString: string) => void;
  isValidFilterString?: boolean;
  queryBuilderRuleGroup?: RuleGroupType;
  onUpdateQueryBuilder: (ruleGroup: RuleGroupType | false) => void;
  handleSearch: (searchParams?: SearchParams) => void;
  onToggleFilterBuilder: (isVisible: boolean) => void;
  prefilledFieldOptions: FieldToOperatorMap;
  useAdvancedNestedSearch?: boolean;
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
  onToggleFilterBuilder,
  useAdvancedNestedSearch = true,
}: WfoFilterBuilderProps) => {
  const mapOperatorsToRQBOperatorOptions = (operators?: string[]): FullOperator[] => {
    return (operators ?? []).map((operator) => {
      const { symbol, description } = OPERATOR_MAP[operator] || { symbol: operator, description: operator };
      const rqbOperator = SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP[operator] ?? operator;
      return {
        name: rqbOperator,
        label: `${symbol} ${description}`,
        value: rqbOperator,
        ...(RQB_UNARY_OPERATORS.includes(rqbOperator) && { arity: 'unary' }),
      };
    });
  };

  const t = useTranslations('common');
  const { queryBuilderContainerStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const [fieldToOperatorMap, setFieldToOperatorMap] = useState<FieldToOperatorMap>(prefilledFieldOptions);
  // Path info per selected field, so the value editor can pick a typed editor (date picker,
  // number input, boolean toggle or range editor)
  const [fieldPathInfoMap, setFieldPathInfoMap] = useState<Map<string, PathInfo>>(new Map());

  // Enter in a value editor commits its value on blur, and that state update has not
  // flushed yet when the search runs in the same keydown. onQueryChange fires
  // synchronously during the blur, so this ref always holds the freshest rule group,
  // which is passed to handleSearch explicitly (same pattern as the remove-filter link).
  const latestRuleGroupRef = useRef<RuleGroupType | undefined>(queryBuilderRuleGroup);
  latestRuleGroupRef.current = queryBuilderRuleGroup;

  const handleValueEditorEnter = () => {
    handleSearch({ ruleGroup: latestRuleGroupRef.current });
  };

  const handleFieldSelected = (field: string, operators: string[], pathInfo?: PathInfo) => {
    setFieldToOperatorMap((previousMap) => {
      return new Map(previousMap).set(field, operators);
    });
    if (pathInfo) {
      setFieldPathInfoMap((previousMap) => {
        return new Map(previousMap).set(field, pathInfo);
      });
    }
  };

  // Fields can enter the query without passing through the field selector — a filter
  // restored from the URL or added by a column-header search. Resolve their path info
  // so the value editor renders the right input type (date picker, boolean toggle, ...)
  // and the operator selector gets the field's operator list.
  const unresolvedFields = useMemo(
    () =>
      collectRuleFields(queryBuilderRuleGroup).filter(
        (field) => field && field !== '~' && !fieldPathInfoMap.has(field),
      ),
    [queryBuilderRuleGroup, fieldPathInfoMap],
  );
  const resolvedFieldsPathInfo = useFieldsPathInfo(unresolvedFields, EntityKind.SUBSCRIPTION);

  const queryBuilderContext: WfoQueryBuilderContext = {
    onFieldSelected: handleFieldSelected,
    prefilledFieldOptions,
    fieldPathInfoMap,
    onValueEditorEnter: handleValueEditorEnter,
    useAdvancedNestedSearch,
  };

  useEffect(() => {
    resolvedFieldsPathInfo.forEach((pathInfo, field) => {
      if (pathInfo && !fieldPathInfoMap.has(field)) {
        handleFieldSelected(field, pathInfo.operators, pathInfo);
      }
    });
  }, [fieldPathInfoMap, resolvedFieldsPathInfo]);

  return (
    <EuiFlexGroup css={queryBuilderContainerStyles}>
      <EuiFlexGroup direction={'column'}>
        <EuiFlexItem>
          <QueryBuilder
            query={queryBuilderRuleGroup}
            enableMountQueryChange={false}
            onQueryChange={(ruleGroup: RuleGroupType) => {
              latestRuleGroupRef.current = ruleGroup;
              onUpdateQueryBuilder(ruleGroup);
            }}
            context={queryBuilderContext}
            getOperators={(field) => {
              const operators = fieldToOperatorMap.get(field);
              return mapOperatorsToRQBOperatorOptions(operators);
            }}
            controlElements={{
              // WfoFieldSelector requires the context this QueryBuilder always provides,
              // while react-querybuilder declares it optional — hence the cast.
              fieldSelector: WfoFieldSelector as ComponentType<FieldSelectorProps>,
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
              // Field-to-field comparisons are not supported, but a rule can briefly hold
              // valueSource 'field' while a CEL literal is being typed in the textarea
              // ('lldp == fals' parses 'fals' as an identifier) — without this override
              // react-querybuilder's default value source selector flashes into the rule.
              valueSourceSelector: null,
            }}
            addRuleToNewGroups
            onAddGroup={onAddGroupHandler}
            maxLevels={5}
            showCombinatorsBetweenRules
            resetOnFieldChange={false}
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
            onKeyDown={(event) => {
              // Enter applies the filter like the Apply button (and like it, does nothing
              // while the filter string is invalid); Shift+Enter inserts a newline.
              if (event.key !== 'Enter' || event.shiftKey) return;
              event.preventDefault();
              if (isValidFilterString) {
                handleSearch();
              }
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
    </EuiFlexGroup>
  );
};
