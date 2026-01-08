import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const panelStyle = css({
        display: 'flex',
        padding: theme.base * 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.base / 2,
        backgroundColor: theme.colors.backgroundBasePlain,
        borderRadius: theme.border.radius.medium,
        color: theme.colors.link,
        fontFamily: theme.font.family,
        marginTop: theme.base * 2,
    });

    return {
        panelStyle,
    };
};
