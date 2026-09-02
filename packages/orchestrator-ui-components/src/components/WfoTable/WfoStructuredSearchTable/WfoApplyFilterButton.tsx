import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton } from '@elastic/eui';

import { WfoDebounceCountdown } from '@/components/WfoTable/WfoStructuredSearchTable/WfoDebounceCountdown';
import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { DebouncedPendingRun, useWithOrchestratorTheme } from '@/hooks';

interface ApplyFilterButtonProps {
  isDisabled: boolean;
  pendingSearchRun?: DebouncedPendingRun;
  onClick: () => void;
}

export const WfoApplyFilterButton = ({ isDisabled, pendingSearchRun, onClick }: ApplyFilterButtonProps) => {
  const t = useTranslations('common');
  const { applyFilterContentStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);

  return (
    <EuiButton
      onClick={onClick}
      id={'button-apply-filter'}
      data-test-id={'button-apply-filter'}
      fill
      type="submit"
      aria-label={t('applyFilter')}
      disabled={isDisabled}
    >
      <span css={applyFilterContentStyles}>
        {pendingSearchRun && <WfoDebounceCountdown key={pendingSearchRun.id} durationMs={pendingSearchRun.delay} />}
        {t('applyFilter')}
      </span>
    </EuiButton>
  );
};
