import React, { ReactNode } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPageHeader } from '@elastic/eui';

import { WfoWebsocketStatusBadge } from '@/components';
import { useGetOrchestratorConfig } from '@/hooks';

interface WfoTitleWithWebsocketBadgeProps {
  title: string | ReactNode;
  wsUrl?: string;
  extraElement?: ReactNode;
}

export const WfoTitleWithWebsocketBadge = ({
  title,
  wsUrl = undefined,
  extraElement,
}: WfoTitleWithWebsocketBadgeProps) => {
  const { useWebSockets } = useGetOrchestratorConfig();

  const pageTitle =
    useWebSockets || extraElement ?
      <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
        <EuiFlexItem grow={false}>{title}</EuiFlexItem>
        {useWebSockets && (
          <EuiFlexItem grow={false}>
            <WfoWebsocketStatusBadge wsUrl={wsUrl} />
          </EuiFlexItem>
        )}
        {extraElement && <EuiFlexItem grow={false}>{extraElement}</EuiFlexItem>}
      </EuiFlexGroup>
    : title;

  return <EuiPageHeader pageTitle={pageTitle} />;
};
