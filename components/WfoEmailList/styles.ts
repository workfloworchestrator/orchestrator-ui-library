import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const sendEmailButtonStyle = css({
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%238B8B8BFF' stroke-width='2' stroke-dasharray='2px, 6px' stroke-linecap='square'/%3e%3c/svg%3e");border-radius: 10px`,
        '&:hover': {
            cursor: 'pointer',
            textDecoration: `underline ${theme.colors.primary}`,
        },
    });

    const stepSpacerStyle = css({
        borderLeft: `1px solid ${theme.colors.darkShade}`,
        height: theme.size.l,
        marginLeft: theme.size.xl,
    });

    const stepRowStyle = css({
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    });

    const stepListHeaderStyle = css({
        marginBottom: theme.size.l,
        marginTop: theme.size.xxxl,
        alignItems: 'flex-end',
    });

    const stepListContentStyle = css({
        flexDirection: 'row',
        alignItems: 'center',
    });

    const stepListContentBoldTextStyle = css({
        fontSize: theme.size.base,
        fontWeight: theme.font.weight.bold,
    });

    const stepListContentAnchorStyle = css({
        marginTop: theme.size.xxs,
        marginLeft: 0,
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.bold,
        color: theme.colors.link,
        cursor: 'pointer',
    });

    const stepListOptionsContainerStyle = css({
        flexGrow: 0,
    });

    const stepDurationStyle = {
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.semiBold,
    };

    const stepHeaderRightStyle = css({
        alignItems: 'center',
    });

    const stepEmailContainerStyle = css({
        paddingLeft: 24,
        width: 600,
        marginTop: 0,
    });

    const getStepHeaderStyle = (isClickable: boolean) =>
        css({
            gap: 0,
            alignItems: 'center',
            cursor: isClickable ? 'pointer' : 'default',
        });

    const getStepToggleExpandStyle = (isVisible: boolean) =>
        css({
            marginRight: theme.base / 2,
            visibility: isVisible ? 'visible' : 'hidden',
        });

    const recipientButtonStyle = css({
        fontWeight: theme.font.weight.semiBold,
        cursor: 'pointer',
        '&:hover': {
            textDecoration: `underline ${theme.colors.primaryText}`,
        },
    });

    return {
        sendEmailButtonStyle,
        stepDurationStyle,
        stepEmailContainerStyle,
        stepHeaderRightStyle,
        stepListContentAnchorStyle,
        stepListContentBoldTextStyle,
        stepListContentStyle,
        stepListHeaderStyle,
        stepListOptionsContainerStyle,
        stepRowStyle,
        stepSpacerStyle,
        recipientButtonStyle,
        getStepHeaderStyle,
        getStepToggleExpandStyle,
    };
};
