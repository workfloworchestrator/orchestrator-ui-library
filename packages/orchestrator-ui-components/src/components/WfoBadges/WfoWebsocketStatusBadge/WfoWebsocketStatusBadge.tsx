import React, { useCallback, useEffect } from 'react';
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
    const dispatch = useDispatch();
    const { connectedStyle, disconnectedStyle } =
        useWithOrchestratorTheme(getStyles);

    const t = useTranslations('main');
    const { theme } = useOrchestratorTheme();
    const { data: websocketConnected = false } = useStreamMessagesQuery();

    const reconnect = useCallback(() => {
        dispatch(orchestratorApi.util.resetApiState());
    }, [dispatch]);

    useEffect(() => {
        const handleOnFocus = () => {
            if (!websocketConnected) {
                reconnect();
            }
        };
        window.addEventListener('focus', handleOnFocus);
        return () => {
            window.removeEventListener('focus', handleOnFocus);
        };
    }, [dispatch, reconnect, websocketConnected]);

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
                        <WfoBoltSlashFill color={theme.colors.warning} />
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
