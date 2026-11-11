import React from 'react';

import { transparentize } from '@elastic/eui';

import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { WfoStatusDotIcon } from '@/icons/WfoStatusDotIcon';
import { useGetEngineStatusQuery } from '@/rtk';
import { useLazyStreamMessagesQuery } from '@/rtk/endpoints/streamMessages';
import { EngineStatus } from '@/types';

import { WfoHeaderBadge } from '../WfoHeaderBadge';

export const WfoEngineStatusBadge = () => {
  const { theme } = useOrchestratorTheme();
  const { data } = useGetEngineStatusQuery();
  const { engineStatus } = data || {};
  const { useWebSockets } = useGetOrchestratorConfig();

  const { orchestratorWebsocketUrl } = useGetOrchestratorConfig();
  const [websocketTrigger, { isUninitialized }] = useLazyStreamMessagesQuery();

  if (useWebSockets && isUninitialized) {
    websocketTrigger(orchestratorWebsocketUrl);
  }

  const engineStatusText: string = engineStatus ? `Engine is ${engineStatus}` : 'Engine status is unavailable';

  const engineColor = engineStatus === EngineStatus.RUNNING ? theme.colors.success : theme.colors.warning;

  const transparentBgColor = transparentize(theme.colors.shadow, 0);

  return (
    <WfoHeaderBadge
      color={transparentBgColor}
      textColor={theme.colors.textGhost}
      iconType={() => <WfoStatusDotIcon color={engineColor} />}
    >
      {engineStatusText}
    </WfoHeaderBadge>
  );
};
