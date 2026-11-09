import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getWfoStructuredSearchTableStyles } from './styles';

export const WfoAddRuleAction = (props: ActionProps) => {
  const { addRulePlusStyles, addRuleContainerStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);

  const t = useTranslations('search.page');

  return (
    <EuiFlexItem grow={false} onClick={() => props.handleOnClick()} css={addRuleContainerStyles}>
      <span css={addRulePlusStyles}>+</span>
      {t('addRule')}
    </EuiFlexItem>
  );
};
