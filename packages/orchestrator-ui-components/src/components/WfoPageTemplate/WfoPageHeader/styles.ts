import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getWfoPageHeaderStyles = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const appNameStyle = css({
        paddingRight: theme.base,
        marginRight: theme.base,
        borderRight: `${theme.border.width.thick} solid ${theme.colors.subduedText}`,
    });

    const getHeaderStyle = (navigationHeight: number) => {
        return css({
            backgroundColor: theme.colors.header,
            height: navigationHeight,
            borderBottom: theme.colors.header, // Overrides EuiHeader default border bottom
        });
    };

    return {
        appNameStyle,
        getHeaderStyle,
    };
};
