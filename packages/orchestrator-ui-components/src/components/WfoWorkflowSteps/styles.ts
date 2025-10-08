import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getWorkflowStepsStyles = ({
    theme,
    toSecondaryColor,
}: WfoTheme) => {
    const SPACE_BETWEEN_STEPS = theme.base * 1.5;

    const stepSpacerStyle = css({
        borderLeft: `1px solid ${theme.colors.darkShade}`,
        height: `${SPACE_BETWEEN_STEPS}px`,
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
        color: theme.colors.disabled,
        fontWeight: theme.font.weight.semiBold,
    };

    const stepStateSuccessIconStyle = css({
        ...stepStateIcon,
        backgroundColor: toSecondaryColor(theme.colors.primary),
    });

    const stepStateSuspendIconStyle = css({
        ...stepStateIcon,
        backgroundColor: toSecondaryColor(theme.colors.warning),
    });

    const stepStatePendingIconStyle = css({
        ...stepStateIcon,
        backgroundColor: toSecondaryColor(theme.colors.darkShade),
    });
    const stepStateFailedIconStyle = css({
        ...stepStateIcon,
        backgroundColor: toSecondaryColor(theme.colors.danger),
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
        SPACE_BETWEEN_STEPS,
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
