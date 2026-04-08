import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiSpacer, EuiToolTip } from '@elastic/eui';

import { WfoHeaderBadge } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { MappedVersion } from '@/types';
import { getOrchestratorCoreVersionIfNotCompatible } from '@/utils/compareVersions';

import versionCompatibility from '../../../../../../version-compatibility.json';

interface WfoVersionIncompatibleBadgeProps {
  orchestratorUiVersion: string;
  orchestratorCoreVersion: string;
}

export const WfoVersionIncompatibleBadge: FC<WfoVersionIncompatibleBadgeProps> = ({
  orchestratorUiVersion,
  orchestratorCoreVersion,
}) => {
  const t = useTranslations('main');
  const { theme } = useOrchestratorTheme();
  const mappedVersions: MappedVersion[] = versionCompatibility;
  const isReady = orchestratorCoreVersion && orchestratorUiVersion;

  const minimumOrchestratorCoreVersion =
    isReady ?
      getOrchestratorCoreVersionIfNotCompatible(orchestratorUiVersion, orchestratorCoreVersion, mappedVersions)
    : null;

  return (
    <EuiToolTip
      content={
        <>
          <p>{t('incompatibleVersionText')}</p>
          <EuiSpacer size="s" />
          <p>
            WFO UI: <b>{orchestratorUiVersion}</b>
          </p>
          <p>
            orchestrator-core: <b>{orchestratorCoreVersion}</b>
          </p>
          <p>
            {t('minimumOrchestratorCoreVersion')}: <b>{minimumOrchestratorCoreVersion}</b>
          </p>
        </>
      }
    >
      <WfoHeaderBadge
        color="danger"
        textColor={theme.colors.textGhost}
        css={{
          marginLeft: theme.size.s,
          display: minimumOrchestratorCoreVersion ? 'block' : 'none',
        }}
      >
        {t('incompatibleVersion')}
      </WfoHeaderBadge>
    </EuiToolTip>
  );
};
