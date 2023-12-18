import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const stepStateIcon = {
        height: '42px',
        width: '42px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '24px',
        border: `2px solid ${theme.colors.emptyShade}`,
    };

    const openIconStyle = css({
        ...stepStateIcon,
        backgroundColor: '#D9EDE1',
        color: theme.colors.success,
    });

    const updateIconStyle = css({
        ...stepStateIcon,
        backgroundColor: '#CCE3F4',
        color: theme.colors.primary,
    });

    const closedIconStyle = css({
        ...stepStateIcon,
        backgroundColor: '#DCE4EF',
        color: theme.colors.subduedText,
    });

    return {
        closedIconStyle,
        updateIconStyle,
        openIconStyle,
    };
};
