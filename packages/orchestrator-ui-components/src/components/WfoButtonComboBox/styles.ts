import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getWfoButtonComboBoxStyles = ({ theme }: WfoTheme) => {
    const selectableStyle = css({
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

    const titleStyle = css({
        fontWeight: theme.font.weight.semiBold,
    });

    return {
        selectableStyle,
        titleStyle,
    };
};
