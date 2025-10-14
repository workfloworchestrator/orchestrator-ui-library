import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const monacoEditorStyle = css({
        marginTop: 10,
        padding: 10,
        backgroundColor: theme.colors.body,
        borderRadius: theme.border.radius.medium,
    });

    return {
        monacoEditorStyle,
    };
};
