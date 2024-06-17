import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPageHeader } from '@elastic/eui';

import { WfoWebsocketStatusBadge } from '@/components';
import { useGetOrchestratorConfig } from '@/hooks';

interface WfoTitleWithWebsocketBadgeProps {
    title: string;
}

export const WfoTitleWithWebsocketBadge = ({
    title,
}: WfoTitleWithWebsocketBadgeProps) => {
    const { useWebSockets } = useGetOrchestratorConfig();

    return (
        <EuiFlexGroup gutterSize="s" alignItems="baseline">
            <EuiFlexItem grow={0}>
                <EuiPageHeader pageTitle={title} />
            </EuiFlexItem>
            <EuiFlexItem grow={0}>
                {useWebSockets && <WfoWebsocketStatusBadge />}
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
