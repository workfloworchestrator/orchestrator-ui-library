import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const stepSpacerStyle = css({
        borderLeft: `1px solid ${theme.colors.darkShade}`,
        height: '24px',
        marginLeft: '36px',
    });

    const stepHeaderStyle = css({
        gap: 0,
        alignItems: 'flex-start',
        marginBottom: 10,
    });

    const stepRowStyle = css({
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    });

    const stepListHeaderStyle = css({
        marginBottom: '24px',
        marginTop: '60px',
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
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.bold,
        color: theme.colors.link,
        cursor: 'pointer',
    });

    const stepListOptionsContainerStyle = css({
        flexGrow: 0,
    });

    const stepStateIcon = {
        height: '40px',
        width: '40px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '24px',
    };

    const stepDurationStyle = {
        fontSize: theme.size.m,
        color: theme.colors.disabled,
        fontWeight: theme.font.weight.semiBold,
    };

    const stepToggleExpandStyle = css({
        marginRight: theme.base / 2,
        cursor: 'pointer',
    });

    const stepStateSuccessIconStyle = css({
        ...stepStateIcon,
        backgroundColor: '#CCE3F4',
    });

    const stepStateSuspendIconStyle = css({
        ...stepStateIcon,
        backgroundColor: '#FFF3D0',
    });

    const stepStatePendingIconStyle = css({
        ...stepStateIcon,
        backgroundColor: '#DCE4EF',
    });
    const stepStateFailedIconStyle = css({
        ...stepStateIcon,
        backgroundColor: '#F2D4D2',
    });

    const stepHeaderRightStyle = css({
        alignItems: 'center',
    });

    return {
        stepSpacerStyle,
        stepHeaderStyle,
        stepHeaderRightStyle,
        stepRowStyle,
        stepListHeaderStyle,
        stepListContentStyle,
        stepListContentBoldTextStyle,
        stepListContentAnchorStyle,
        stepListOptionsContainerStyle,
        stepStateSuccessIconStyle,
        stepStateSuspendIconStyle,
        stepStatePendingIconStyle,
        stepStateFailedIconStyle,
        stepToggleExpandStyle,
        stepDurationStyle,
    };
};
