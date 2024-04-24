import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const comboBoxWidth = '300px';

    const selectableStyle = css({
        width: comboBoxWidth,

        '.euiFieldSearch': {
            backgroundColor: theme.colors.body,
            color: theme.colors.text,
            '&:focus': {
                backgroundColor: theme.colors.emptyShade,
            },
        },

        '.euiSelectableList .euiSelectableListItem': {
            borderColor: theme.colors.lightShade,
        },
    });

    return {
        selectableStyle,
    };
};
