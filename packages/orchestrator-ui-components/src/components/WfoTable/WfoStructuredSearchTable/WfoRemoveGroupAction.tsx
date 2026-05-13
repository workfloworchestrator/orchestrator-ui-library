import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiFlexItem } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export const WfoRemoveGroupAction = (props: ActionProps) => {
  const { removeGroupActionStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const t = useTranslations('search.page');
  return (
    <EuiFlexItem css={removeGroupActionStyles}>
      <EuiButtonIcon onClick={props.handleOnClick} iconType="trash" color="danger" aria-label={t('removeGroup')} />
    </EuiFlexItem>
  );
};
