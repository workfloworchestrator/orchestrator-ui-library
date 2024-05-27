import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiToolTip } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks/useOrchestratorTheme';
import { WfoBoltFill, WfoBoltSlashFill } from '@/icons';
import { useStreamMessagesQuery } from '@/rtk/endpoints/streamMessages';

import { WfoHeaderBadge } from '../WfoHeaderBadge';

export const WfoWebsocketStatusBadge = () => {
    const t = useTranslations('main');
    const { theme } = useOrchestratorTheme();
    const { data: websocketConnected = false } = useStreamMessagesQuery();

    const reconnect = () => {
        alert('reconnect');
    };

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
                color={theme.colors.ghost}
                textColor={theme.colors.shadow}
                iconType={() =>
                    websocketConnected ? (
                        <WfoBoltFill color={theme.colors.success} />
                    ) : (
                        <WfoBoltSlashFill color={theme.colors.danger} />
                    )
                }
                style={{
                    paddingLeft: '8px',
                    cursor: !websocketConnected ? 'pointer' : 'default',
                }}
                onClick={
                    !websocketConnected
                        ? () => reconnect()
                        : () => {
                              return;
                          }
                }
                onClickAriaLabel={'undefined'}
                iconOnClick={undefined}
                iconOnClickAriaLabel={undefined}
            />
        </EuiToolTip>
    );
};
