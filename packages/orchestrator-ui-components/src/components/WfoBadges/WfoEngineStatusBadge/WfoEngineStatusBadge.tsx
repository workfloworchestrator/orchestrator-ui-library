import React from 'react';

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
  const [websocketTrigger, { isUninitialized }] = useLazyStreamMessagesQuery();

  if (useWebSockets && isUninitialized) {
    websocketTrigger();
  }

  const engineStatusText: string = engineStatus ? `Engine is ${engineStatus}` : 'Engine status is unavailable';

  const engineColor = engineStatus === EngineStatus.RUNNING ? theme.colors.success : theme.colors.warning;

  return (
    <WfoHeaderBadge
      color={theme.colors.backgroundBaseNeutral}
      textColor={theme.colors.textParagraph}
      iconType={() => <WfoStatusDotIcon color={engineColor} />}
    >
      {engineStatusText}
    </WfoHeaderBadge>
  );
};
