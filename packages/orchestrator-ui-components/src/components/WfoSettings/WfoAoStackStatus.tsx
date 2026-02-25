import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexItem, EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';

import { useGetOrchestratorConfig } from '@/hooks';
import { WfoChartBar } from '@/icons';

export const WfoAoStackStatus = () => {
  const t = useTranslations('settings.page');
  const { aoStackStatusUrl } = useGetOrchestratorConfig();

  const openStatusPage = () => {
    window.open(aoStackStatusUrl, '_blank');
  };

  return (
    <EuiFlexItem>
      <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
        <EuiText size="s">
          <h4>{t('aoStackStatus')}</h4>
        </EuiText>
        <EuiSpacer size="m" />
        <EuiButton iconType={() => <WfoChartBar />} onClick={openStatusPage}>
          {t('viewStatusPage')}
        </EuiButton>
      </EuiPanel>
    </EuiFlexItem>
  );
};
