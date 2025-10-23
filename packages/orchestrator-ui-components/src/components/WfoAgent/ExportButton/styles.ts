import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getExportButtonStyles = ({ theme }: WfoTheme) => {
    const containerStyle = css({
        marginTop: theme.size.xl,
        marginBottom: theme.size.xl,
        width: '100%',
    });

    const buttonWrapperStyle = css({
        backgroundColor: theme.colors.lightestShade,
        padding: `${theme.size.xl} ${theme.size.xl}`,
        border: `${theme.border.width.thin} solid transparent`,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.size.l,
    });

    const titleStyle = css({
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.semiBold,
        color: theme.colors.darkestShade,
    });

    const fileRowStyle = css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.size.m,
        border: `${theme.border.width.thin} solid ${theme.colors.lightShade}`,
        borderRadius: theme.border.radius.medium,
        padding: `${theme.size.m} ${theme.size.l}`,
        backgroundColor: theme.colors.emptyShade,
        cursor: 'pointer',
    });

    const fileInfoStyle = css({
        display: 'flex',
        alignItems: 'center',
        gap: theme.size.m,
        flex: 1,
        color: theme.colors.darkestShade,
    });

    const filenameStyle = css({
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.medium,
        color: theme.colors.darkestShade,
    });

    const downloadButtonStyle = css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.darkestShade,
    });

    return {
        containerStyle,
        buttonWrapperStyle,
        titleStyle,
        fileRowStyle,
        fileInfoStyle,
        filenameStyle,
        downloadButtonStyle,
    };
};
