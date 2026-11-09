import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';
import { useOrchestratorTheme } from '@/hooks';
import { WfoTrashFilled } from '@/icons';

export const WfoRemoveGroupAction = ({ onClick }: { onClick: () => void }) => {
  const { removeGroupActionStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const { theme } = useOrchestratorTheme();
  const t = useTranslations('search.page');
  return (
    <EuiFlexItem grow={0} css={removeGroupActionStyles} onClick={() => onClick()}>
      <WfoTrashFilled color={theme.colors.textPrimary} aria-label={t('removeGroup')} />
    </EuiFlexItem>
  );
};
