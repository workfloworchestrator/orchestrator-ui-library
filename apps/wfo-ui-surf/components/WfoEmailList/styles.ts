import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const sendEmailButtonStyle = css({
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%238B8B8BFF' stroke-width='2' stroke-dasharray='0.25%25%2c 0.5%25' stroke-dashoffset='15' stroke-linecap='square'/%3e%3c/svg%3e");border-radius: 10px`,
    });

    const stepSpacerStyle = css({
        borderLeft: `1px solid ${theme.colors.darkShade}`,
        height: '24px',
        marginLeft: '36px',
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
        marginTop: 2,
        marginLeft: 0,
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
        fontWeight: theme.font.weight.semiBold,
    };

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
        stepStateFailedIconStyle,
        stepStatePendingIconStyle,
        stepStateSuccessIconStyle,
        stepStateSuspendIconStyle,
        getStepHeaderStyle,
        getStepToggleExpandStyle,
    };
};
