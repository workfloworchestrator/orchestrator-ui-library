import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoXMarkSmall } from '@/icons/WfoXMarkSmall';

export const WfoRemoveRuleAction = (props: ActionProps) => {
  const { theme } = useOrchestratorTheme();

  const t = useTranslations('search.page');
  return (
    <EuiFlexItem onClick={props.handleOnClick} css={{ cursor: 'pointer' }}>
      <WfoXMarkSmall color={theme.colors.primary} aria-label={t('removeRule')} />
    </EuiFlexItem>
  );
};
