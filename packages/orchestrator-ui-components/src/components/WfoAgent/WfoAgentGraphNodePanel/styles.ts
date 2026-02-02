import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getGraphNodePanelStyles = ({ theme }: WfoTheme) => {
    const panelStyles = css({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '350px',
        height: '100%',
        backgroundColor: theme.colors.emptyShade,
        borderLeft: `${theme.border.width.thin} solid ${theme.colors.lightShade}`,
        boxShadow: theme.levels.flyout,
        overflowY: 'auto',
        zIndex: 1000,
        padding: theme.size.l,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.size.l,
    });

    const headerStyles = css({
        paddingTop: theme.size.l,
    });

    const closeButtonStyles = css({
        position: 'absolute',
        top: theme.size.s,
        right: theme.size.s,
    });

    const sectionTitleStyles = css({
        fontSize: theme.size.xs,
        fontWeight: theme.font.weight.bold,
        color: theme.colors.textSubdued,
        marginBottom: theme.size.s,
        letterSpacing: '0.5px',
    });

    const sectionContentStyles = css({
        padding: theme.size.s,
        backgroundColor: theme.colors.lightestShade,
        borderRadius: theme.border.radius.medium,
        border: `${theme.border.width.thin} solid ${theme.colors.lightShade}`,
    });

    const toolCallListStyles = css({
        display: 'flex',
        flexDirection: 'column',
    });

    return {
        panelStyles,
        headerStyles,
        closeButtonStyles,
        sectionTitleStyles,
        sectionContentStyles,
        toolCallListStyles,
    };
};
