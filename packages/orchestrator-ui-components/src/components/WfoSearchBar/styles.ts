import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getWfoSearchBarStyles = ({ theme }: WfoTheme) => {
    const searchBarStyle = css({
        backgroundColor: theme.colors.body,
        color: theme.colors.text,
        '&:focus': {
            backgroundColor: theme.colors.emptyShade,
        },
    });

    return {
        searchBarStyle,
    };
};
