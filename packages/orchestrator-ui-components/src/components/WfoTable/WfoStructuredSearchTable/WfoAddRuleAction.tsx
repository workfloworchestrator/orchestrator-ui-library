import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexItem } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export const WfoAddRuleAction = (props: ActionProps) => {
  const t = useTranslations('search.page');
  const { toggleButtonStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  return (
    <EuiFlexItem grow={false}>
      <EuiButton css={toggleButtonStyles} fill iconType="plusInCircle" onClick={props.handleOnClick}>
        {t('addCondition')}
      </EuiButton>
    </EuiFlexItem>
  );
};
