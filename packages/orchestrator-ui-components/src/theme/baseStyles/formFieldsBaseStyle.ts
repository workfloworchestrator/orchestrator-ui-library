import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getFormFieldsBaseStyle = ({ theme }: WfoTheme) => {
    const formFieldBaseStyle = css({
        backgroundColor: theme.colors.body,
        color: theme.colors.text,
        '&:focus': {
            backgroundColor: theme.colors.emptyShade,
        },
    });

    return {
        formFieldBaseStyle,
    };
};
