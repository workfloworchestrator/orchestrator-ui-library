import React from 'react';

import { EuiPageHeader } from '@elastic/eui';

import { WfoWebsocketStatusBadge } from '@/components';
import { useGetOrchestratorConfig } from '@/hooks';

interface WfoTitleWithWebsocketBadgeProps {
  title: string;
}

export const WfoTitleWithWebsocketBadge = ({ title }: WfoTitleWithWebsocketBadgeProps) => {
  const { useWebSockets } = useGetOrchestratorConfig();

  const pageTitle =
    useWebSockets ?
      <>
        {title} <WfoWebsocketStatusBadge />
      </>
    : title;

  return <EuiPageHeader pageTitle={pageTitle} />;
};
