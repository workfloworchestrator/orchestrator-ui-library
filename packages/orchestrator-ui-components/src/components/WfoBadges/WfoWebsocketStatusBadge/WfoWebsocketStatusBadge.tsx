import React from 'react';
import { useDispatch } from 'react-redux';

import { useTranslations } from 'next-intl';

import { EuiToolTip } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { useOrchestratorTheme } from '@/hooks/useOrchestratorTheme';
import { WfoBoltFill, WfoBoltSlashFill } from '@/icons';
import { orchestratorApi } from '@/rtk';
import { useStreamMessagesQuery } from '@/rtk/endpoints/streamMessages';

import { WfoHeaderBadge } from '../WfoHeaderBadge';
import { getStyles } from './styles';

export const WfoWebsocketStatusBadge = () => {
    const { connectedStyle, disconnectedStyle } =
        useWithOrchestratorTheme(getStyles);

    const dispatch = useDispatch();
    const t = useTranslations('main');
    const { theme } = useOrchestratorTheme();
    const { data: websocketConnected = false } = useStreamMessagesQuery();

    const reconnect = () => {
        dispatch(orchestratorApi.util.resetApiState());
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
                textColor={theme.colors.shadow}
                iconType={() =>
                    websocketConnected ? (
                        <WfoBoltFill color={theme.colors.success} />
                    ) : (
                        <WfoBoltSlashFill color="yellow" />
                    )
                }
                css={websocketConnected ? connectedStyle : disconnectedStyle}
                onClick={() => {
                    if (!websocketConnected) {
                        reconnect();
                    }
                }}
                onClickAriaLabel={'undefined'}
                iconOnClick={undefined}
                iconOnClickAriaLabel={undefined}
            />
        </EuiToolTip>
    );
};
