import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
    const monacoEditorStyle = css({
        marginTop: 10,
        padding: 10,
        backgroundColor: theme.colors.backgroundBaseSubdued,
        borderRadius: theme.border.radius.medium,
    });

    return {
        monacoEditorStyle,
    };
};
