import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoTrashFilled } from '@/icons';

export const WfoRemoveRuleAction = (props: ActionProps) => {
  const { theme } = useOrchestratorTheme();

  const t = useTranslations('search.page');
  return (
    <EuiFlexItem onClick={props.handleOnClick} css={{ cursor: 'pointer', paddingRight: theme.size.s }}>
      <WfoTrashFilled color={theme.colors.textPrimary} aria-label={t('removeRule')} />
    </EuiFlexItem>
  );
};
