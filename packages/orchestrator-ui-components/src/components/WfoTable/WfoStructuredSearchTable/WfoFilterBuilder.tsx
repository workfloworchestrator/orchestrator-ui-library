import React, { useState } from 'react';
import { type Field, QueryBuilder, type RuleGroupType } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiTextArea } from '@elastic/eui';

import { WfoTextAnchor } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';

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

  const fields: Field[] = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
  ];

  return (
    <EuiFlexGroup css={queryBuilderContainerStyles}>
      {(isFilterBuilderVisible && (
        <EuiFlexGroup direction={'column'}>
          <EuiFlexItem>
            <QueryBuilder
              query={queryBuilderRuleGroup}
              onQueryChange={onUpdateQueryBuilder}
              fields={fields}
              disabled={!isValidFilterString}
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
