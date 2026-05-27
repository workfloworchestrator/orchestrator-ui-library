import React, { ReactNode } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPageHeader } from '@elastic/eui';

import { WfoWebsocketStatusBadge } from '@/components';
import { useGetOrchestratorConfig } from '@/hooks';

interface WfoTitleWithWebsocketBadgeProps {
  title: string | ReactNode;
  wsUrl?: string;
}

export const WfoTitleWithWebsocketBadge = ({ title, wsUrl = undefined }: WfoTitleWithWebsocketBadgeProps) => {
  const { useWebSockets } = useGetOrchestratorConfig();

  const pageTitle =
    useWebSockets ?
      <EuiFlexGroup alignItems="center" gutterSize="s">
        <EuiFlexItem grow={false}>{title}</EuiFlexItem>
        <EuiFlexItem grow={false}>
          <WfoWebsocketStatusBadge wsUrl={wsUrl} />
        </EuiFlexItem>
      </EuiFlexGroup>
    : title;

  return <EuiPageHeader pageTitle={pageTitle} />;
};
