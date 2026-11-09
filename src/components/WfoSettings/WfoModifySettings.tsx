import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexItem, EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoEngineStatusButton, WfoIsAllowedToRender } from '@/components';
import { PolicyResource } from '@/configuration';

export const WfoModifySettings = () => {
  const t = useTranslations('settings.page');
  return (
    <EuiFlexItem>
      <WfoIsAllowedToRender resource={PolicyResource.SETTINGS_START_STOP_ENGINE}>
        <EuiSpacer />
        <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
          <EuiText size="s">
            <h4>{t('modifyEngine')}</h4>
          </EuiText>
          <EuiSpacer size="m"></EuiSpacer>
          <WfoEngineStatusButton />
        </EuiPanel>
      </WfoIsAllowedToRender>
    </EuiFlexItem>
  );
};
