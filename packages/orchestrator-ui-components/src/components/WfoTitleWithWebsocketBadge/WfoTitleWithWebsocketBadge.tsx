import React from 'react';

import { EuiPageHeader } from '@elastic/eui';

import { WfoWebsocketStatusBadge } from '@/components';
import { useGetOrchestratorConfig } from '@/hooks';

interface WfoTitleWithWebsocketBadgeProps {
  title: string;
  wsUrl?: string;
}

export const WfoTitleWithWebsocketBadge = ({ title, wsUrl = undefined }: WfoTitleWithWebsocketBadgeProps) => {
  const { useWebSockets } = useGetOrchestratorConfig();

  const pageTitle =
    useWebSockets ?
      <>
        {title} <WfoWebsocketStatusBadge wsUrl={wsUrl} />
      </>
    : title;

  return <EuiPageHeader pageTitle={pageTitle} />;
};
