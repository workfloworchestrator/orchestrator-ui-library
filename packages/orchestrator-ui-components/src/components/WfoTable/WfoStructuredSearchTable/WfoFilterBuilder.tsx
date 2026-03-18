import React, { useState } from 'react';
import { QueryBuilder, type RuleGroupType } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiTextArea } from '@elastic/eui';

import { WfoTextAnchor } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';

import { WfoFieldSelector } from './WfoFieldSelector';
import { WfoOperatorSelector } from './WfoOperatorSelector';
import { getWfoStructuredSearchTableStyles } from './styles';

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

  return (
    <EuiFlexGroup css={queryBuilderContainerStyles}>
      {(isFilterBuilderVisible && (
        <EuiFlexGroup direction={'column'}>
          <EuiFlexItem>
            <QueryBuilder
              query={queryBuilderRuleGroup}
              onQueryChange={onUpdateQueryBuilder}
              disabled={!isValidFilterString}
              controlElHoements={{ fieldSelector: WfoFieldSelector, operatorSelector: WfoOperatorSelector }}
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
