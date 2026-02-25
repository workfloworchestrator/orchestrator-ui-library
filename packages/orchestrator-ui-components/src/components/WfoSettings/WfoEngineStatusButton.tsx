import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton } from '@elastic/eui';

import { useGetEngineStatusQuery, useSetEngineStatusMutation } from '@/rtk';
import { EngineStatus } from '@/types';

export const WfoEngineStatusButton = () => {
  const { data, isLoading } = useGetEngineStatusQuery();
  const { engineStatus } = data || {};
  const [setEngineStatus, { isLoading: isSettingEngineStatus }] = useSetEngineStatusMutation();

  const t = useTranslations('settings.page');
  if (isLoading || isSettingEngineStatus) {
    return (
      <EuiButton isLoading fill>
        Loading...
      </EuiButton>
    );
  }
  return engineStatus === EngineStatus.RUNNING ?
      <EuiButton onClick={() => setEngineStatus(true)} color="warning" fill iconType="pause">
        {t('pauseEngine')}
      </EuiButton>
    : <EuiButton onClick={() => setEngineStatus(false)} color="primary" fill iconType="play">
        {t('startEngine')}
      </EuiButton>;
};
