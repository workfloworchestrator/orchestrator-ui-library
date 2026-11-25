import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon } from '@elastic/eui';

import { WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { WfoArrowsExpand } from '@/icons';

type WfoViewDetailsButtonProps = {
  onClick: () => void;
};

// The same "show all columns in detail view" button for every table
export const WfoViewDetailsButton: FC<WfoViewDetailsButtonProps> = ({ onClick }) => {
  const { theme } = useOrchestratorTheme();
  const t = useTranslations('common');

  return (
    <WfoToolTip tooltipContent={t('showAllColumnsInDetailView')}>
      <EuiButtonIcon
        iconType={() => <WfoArrowsExpand color={theme.colors.textDisabled} />}
        onClick={onClick}
        aria-label={t('showAllColumnsInDetailView')}
      />
    </WfoToolTip>
  );
};
