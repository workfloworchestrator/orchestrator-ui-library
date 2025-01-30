import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiText } from '@elastic/eui';

import { WfoHeaderBadge } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { useOrchestratorTheme } from '@/hooks/useOrchestratorTheme';
import { WfoBoltFill, WfoBoltSlashFill } from '@/icons';
import { orchestratorApi } from '@/rtk';
import { useStreamMessagesQuery } from '@/rtk/endpoints/streamMessages';

import { getStyles } from './styles';

export const WfoHeaderWebsocketBadge = () => {
    const dispatch = useDispatch();
    const { disconnectedStyle } = useWithOrchestratorTheme(getStyles);

    const t = useTranslations('main');
    const { theme } = useOrchestratorTheme();
    const { data: websocketConnected } = useStreamMessagesQuery();

    const reconnect = useCallback(() => {
        dispatch(orchestratorApi.util.resetApiState());
    }, [dispatch]);

    return !websocketConnected ? (
        <EuiFlexGroup gutterSize="s" alignItems="center">
            <EuiText size="s" color={theme.colors.accentText}>
                {t('websocketDisconnectedShort')}
            </EuiText>
            <WfoHeaderBadge
                textColor={theme.colors.shadow}
                iconType={() =>
                    websocketConnected ? (
                        <WfoBoltFill color={theme.colors.success} />
                    ) : (
                        <WfoBoltSlashFill color={theme.colors.warning} />
                    )
                }
                css={disconnectedStyle}
                onClick={() => {
                    if (!websocketConnected) {
                        reconnect();
                    }
                }}
                onClickAriaLabel={'undefined'}
                iconOnClick={undefined}
                iconOnClickAriaLabel={undefined}
            />
        </EuiFlexGroup>
    ) : (
        <></>
    );
};
