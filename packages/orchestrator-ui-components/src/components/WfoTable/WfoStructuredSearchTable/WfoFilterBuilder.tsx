import React, { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import {
  type FieldSelectorProps,
  QueryBuilder,
  type RuleGroupType,
  defaultPlaceholderFieldName,
} from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { SearchParams, WfoAutoExpandableTextArea, WfoTextAnchor } from '@/components';
import { WfoApplyFilterButton } from '@/components/WfoTable/WfoStructuredSearchTable/WfoApplyFilterButton';
import { WfoCombinatorSelector } from '@/components/WfoTable/WfoStructuredSearchTable/WfoCombinatorSelector';
import { useFieldsPathInfo, useWithOrchestratorTheme } from '@/hooks';
import type { FieldToOperatorMap, PathInfo, WfoQueryBuilderContext } from '@/types';
import { EntityKind } from '@/types';

import { WfoFieldSelector } from './WfoFieldSelector';
import { WfoInlineCombinator } from './WfoInlineCombinator';
import { WfoOperatorSelector } from './WfoOperatorSelector';
import { WfoRemoveRuleAction } from './WfoRemoveRuleAction';
import { WfoRule } from './WfoRule';
import { WfoRuleGroup } from './WfoRuleGroup';
import { WfoValueEditor } from './WfoValueEditor';
import { getWfoStructuredSearchTableStyles } from './styles';
import {
  collectRuleFields,
  onAddGroupHandler,
  operatorsToRQBOperatorOptionsMapper,
  useSearchWithDebouncedCallback,
} from './utils';

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
  rules: [{ id: 'rule-0', field: defaultPlaceholderFieldName, operator: '=', value: '' }],
  combinator: 'and',
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
  const t = useTranslations('common');
  const { queryBuilderContainerStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const [fieldToOperatorMap, setFieldToOperatorMap] = useState<FieldToOperatorMap>(prefilledFieldOptions);
  const [fieldPathInfoMap, setFieldPathInfoMap] = useState<Map<string, PathInfo>>(new Map());

  // Enter in a value editor commits its value on blur, and that state update has not
  // flushed yet when the search runs in the same keydown. onQueryChange fires
  // synchronously during the blur, so this ref always holds the freshest rule group,
  // which is passed to handleSearch explicitly (same pattern as the remove-filter link).
  const latestRuleGroupRef = useRef<RuleGroupType | undefined>(queryBuilderRuleGroup);
  latestRuleGroupRef.current = queryBuilderRuleGroup;

  const { handleSubmitSearchOnClick, pendingSearchRun, handleSubmitSearchOnEnter } = useSearchWithDebouncedCallback({
    filterString,
    isValidFilterString,
    searchCallback: () => handleSearch({ ruleGroup: latestRuleGroupRef.current }),
  });

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
        <EuiFlexItem onKeyDown={handleSubmitSearchOnEnter}>
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
              return operatorsToRQBOperatorOptionsMapper(operators);
            }}
            controlElements={{
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
            onKeyDown={handleSubmitSearchOnEnter}
            isInvalid={!isValidFilterString}
          />
        </EuiFlexItem>

        <EuiFlexGroup direction={'rowReverse'} alignItems={'center'}>
          <WfoApplyFilterButton
            isDisabled={!isValidFilterString}
            pendingSearchRun={pendingSearchRun}
            onClick={handleSubmitSearchOnClick}
          />
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
