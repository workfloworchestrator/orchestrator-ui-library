import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export const WfoAddGroupAction = ({ disabled, handleOnClick }: ActionProps) => {
  const t = useTranslations('search.page');
  const { addGroupStyles, addRulePlusStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  return disabled ? null : (
      <EuiFlexItem css={addGroupStyles} onClick={() => handleOnClick()}>
        <span css={addRulePlusStyles}>+</span>&nbsp;{t('addGroup')}
      </EuiFlexItem>
    );
};
