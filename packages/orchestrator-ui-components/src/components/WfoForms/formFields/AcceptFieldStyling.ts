import { css } from '@emotion/react';
import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';

export const getStyles = (theme: EuiThemeComputed) => {
    const acceptFieldStyle = css({
        acceptField: {
            'label.warning': {
                color: theme.colors.danger,
            },
            '.skip': {
                color: theme.colors.success,
                fontStyle: 'italic',
            },

            // Don't touch the margin + padding: they also control if the user can click on the checkbox instead of label
            '.level_2': {
                marginLeft: '24px',
                padding: 0,
                label: {
                    marginTop: 0,
                },
            },
        },
    });

    return {
        acceptFieldStyle: acceptFieldStyle,
    };
};
