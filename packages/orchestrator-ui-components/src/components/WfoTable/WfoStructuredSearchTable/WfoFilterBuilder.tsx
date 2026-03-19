import React, { useState } from 'react';
import { QueryBuilder, type RuleGroupType } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiTextArea } from '@elastic/eui';

import { WfoTextAnchor } from '@/components';
import { getOperatorDisplay } from '@/components/WfoSearchPage/utils';
import { useWithOrchestratorTheme } from '@/hooks';
import { PathInfo } from '@/types';

import { WfoFieldSelector } from './WfoFieldSelector';
import { WfoOperatorSelector } from './WfoOperatorSelector';
import { WfoValueEditor } from './WfoValueEditor';
import { getWfoStructuredSearchTableStyles } from './styles';

// Maps PathInfo operator names to react-querybuilder's native operator names,
// which is what parseCEL produces and formatQuery(cel) expects.
const PATH_OP_TO_RQB_OP: Record<string, string> = {
  eq: '=',
  neq: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  between: 'between',
};
/* TODO: Add the missing operators
['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'between'];
['has_component', 'not_has_component'];
['eq', 'neq', 'like']
 */
type FieldPathInfoMap = Map<string, PathInfo>;

interface WfoFilterBuilderProps {
  filterString?: string;
  onUpdateFilterString: (filterString: string) => void;
  isValidFilterString?: boolean;
  queryBuilderRuleGroup?: RuleGroupType;
  onUpdateQueryBuilder: (ruleGroup: RuleGroupType) => void;
}

export const WfoFilterBuilder = ({
  filterString,
  onUpdateFilterString,
  isValidFilterString = true,
  queryBuilderRuleGroup,
  onUpdateQueryBuilder,
}: WfoFilterBuilderProps) => {
  const t = useTranslations('common');

  const { queryBuilderContainerStyles, toggleButtonStyles, textAreaStyles } = useWithOrchestratorTheme(
    getWfoStructuredSearchTableStyles,
  );
  const [isFilterBuilderVisible, setIsFilterBuilderVisible] = useState(true);
  const [fieldPathInfoMap, setFieldPathInfoMap] = useState<FieldPathInfoMap>(new Map());

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
              onQueryChange={onUpdateQueryBuilder}
              disabled={!isValidFilterString}
              context={{ onFieldSelected: handleFieldSelected, fieldPathInfoMap }}
              getOperators={(field) => {
                const fieldInfo = fieldPathInfoMap.get(field);
                return (fieldInfo?.operators ?? []).map((op) => {
                  const { symbol, description } = getOperatorDisplay(op, fieldInfo);
                  return { name: PATH_OP_TO_RQB_OP[op] ?? op, label: `${symbol} ${description}` };
                });
              }}
              controlElements={{
                fieldSelector: WfoFieldSelector,
                operatorSelector: WfoOperatorSelector,
                valueEditor: WfoValueEditor,
              }}
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
              css={toggleButtonStyles}
              onClick={() => setIsFilterBuilderVisible(true)}
              id={'button-apply-filter'}
              data-test-id={'button-apply-filter'}
              fill
              type="submit"
              aria-label={t('applyFilter')}
            >
              {t('applyFilter')}
            </EuiButton>{' '}
            <WfoTextAnchor text={t('cancel')} onClick={() => setIsFilterBuilderVisible(false)} />
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
