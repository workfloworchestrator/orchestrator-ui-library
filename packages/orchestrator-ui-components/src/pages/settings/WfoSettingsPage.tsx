import React, { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiCodeBlock, EuiFlexItem, EuiPanel, EuiSpacer, EuiTab, EuiTabs, EuiText } from '@elastic/eui';
import { css } from '@emotion/react';

import { WfoEngineStatus, WfoFlushSettings, WfoModifySettings, WfoWorkerStatus } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { getStyles } from '@/components/WfoFilterTabs/styles';
import { WfoAoStackStatus } from '@/components/WfoSettings/WfoAoStackStatus';
import { useGetOrchestratorConfig, useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { useGetEnvironmentVariablesQuery } from '@/rtk';
import { EnvironmentVariable, EnvironmentVariables } from '@/types';

export enum WfoSettingsTab {
  ACTIONS = 'ACTIONS',
  ENV_SETTINGS = 'ENV_SETTINGS',
}

export const WfoActionSettings = () => {
  const { theme } = useOrchestratorTheme();
  const { enableAoStackStatus } = useGetOrchestratorConfig();

  return (
    <>
      <div css={{ maxWidth: theme.base * 40 }}>
        <WfoFlushSettings />
        <EuiSpacer />
        <WfoModifySettings />
        <EuiSpacer />
        <WfoEngineStatus />
        {enableAoStackStatus && (
          <>
            <EuiSpacer />
            <WfoAoStackStatus />
          </>
        )}
        <EuiSpacer />
        <WfoWorkerStatus />
      </div>
    </>
  );
};

export const WfoEnvSettings = () => {
  const t = useTranslations('settings.page');
  const { theme } = useOrchestratorTheme();
  const { data } = useGetEnvironmentVariablesQuery();

  const mapToRepresentableVariables = (variables: EnvironmentVariable[]) => {
    return variables.map(({ env_name, env_value }) => `${env_name}=${env_value}`).join('\n');
  };

  const renderEnvSettings = () => {
    return (
      data
      && data.map(({ name, variables }: EnvironmentVariables) => {
        const showVariables = mapToRepresentableVariables(variables);

        return (
          <>
            <EuiFlexItem>
              <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
                <EuiText size="s">
                  <h2>{name.replace('_', ' ').toUpperCase()}</h2>
                </EuiText>

                <EuiSpacer />

                <EuiCodeBlock
                  fontSize="m"
                  paddingSize="m"
                  css={css({
                    background: theme.colors.borderBaseSubdued,
                  })}
                >
                  {showVariables}
                </EuiCodeBlock>
              </EuiPanel>
            </EuiFlexItem>
            <EuiSpacer />
          </>
        );
      })
    );
  };

  const emptyEnvSettings = () => {
    return (
      <EuiFlexItem>
        <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
          <EuiText size="s">
            <h2>
              {t('noSettingsExposed')}{' '}
              <a
                href="https://workfloworchestrator.org/orchestrator-core/reference-docs/app/settings-overview/"
                target="_blank"
              >
                {t('settingsOverviewLink')}
              </a>
            </h2>
          </EuiText>
        </EuiPanel>
      </EuiFlexItem>
    );
  };

  return <div css={{ maxWidth: theme.base * 45 }}>{data?.length ? renderEnvSettings() : emptyEnvSettings()}</div>;
};

export const settingsTabs = [
  {
    id: WfoSettingsTab.ACTIONS,
    translationKey: 'actions',
    content: <WfoActionSettings />,
  },
  {
    id: WfoSettingsTab.ENV_SETTINGS,
    translationKey: 'envSettings',
    content: <WfoEnvSettings />,
  },
];

export const WfoSettingsPage = () => {
  const t = useTranslations('main');
  const tabTranslations = useTranslations('settings.tabs');
  const { tabStyle } = useWithOrchestratorTheme(getStyles);

  const [selectedTabId, setSelectedTabId] = useQueryParam(
    'activeTab',
    withDefault(StringParam, WfoSettingsTab.ACTIONS),
  );

  const selectedTabContent = useMemo(() => {
    return settingsTabs.find((obj) => obj.id === selectedTabId)?.content;
  }, [selectedTabId]);

  const onSelectedTabChanged = (id: string) => {
    setSelectedTabId(id);
  };

  const renderTabs = () => {
    return settingsTabs.map((tab, index) => (
      <EuiTab
        css={tabStyle}
        key={index}
        onClick={() => onSelectedTabChanged(tab.id)}
        isSelected={tab.id === selectedTabId}
      >
        {tabTranslations(tab.translationKey)}
      </EuiTab>
    ));
  };

  return (
    <>
      <WfoContentHeader title={t('settings')} />

      <EuiTabs>{renderTabs()}</EuiTabs>

      <EuiSpacer size="xxl" />

      {selectedTabContent}
    </>
  );
};
