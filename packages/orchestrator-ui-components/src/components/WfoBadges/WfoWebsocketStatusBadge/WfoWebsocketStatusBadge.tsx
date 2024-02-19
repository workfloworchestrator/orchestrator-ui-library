import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiToolTip } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks/useOrchestratorTheme';
import { WfoStatusDotIcon, WfoXCircleFill } from '@/icons';
import { useStreamMessagesQuery } from '@/rtk/endpoints/streamMessages';

import { WfoHeaderBadge } from '../WfoHeaderBadge';

``;
export const WfoWebsocketStatusBadge = () => {
    const t = useTranslations('main');
    const { theme } = useOrchestratorTheme();
    const { data: websocketConnected = false } = useStreamMessagesQuery();

    return (
        <EuiToolTip
            position="bottom"
            content={
                websocketConnected
                    ? t('websocketConnected')
                    : t('websocketDisconnected')
            }
        >
            <WfoHeaderBadge
                color={theme.colors.emptyShade}
                textColor={theme.colors.shadow}
                iconType={() =>
                    websocketConnected ? (
                        <WfoStatusDotIcon color={theme.colors.success} />
                    ) : (
                        <WfoXCircleFill color={theme.colors.danger} />
                    )
                }
            />
        </EuiToolTip>
    );
};
