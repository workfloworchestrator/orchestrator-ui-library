import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getAcceptFieldStyles = ({ theme }: WfoTheme) => {
    const acceptFieldStyle = css({
        '.acceptField': {
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

            '.labelTitle': {
                fontWeight: '600',
                color: theme.colors.text,
            },
        },
    });

    return {
        acceptFieldStyle: acceptFieldStyle,
    };
};
