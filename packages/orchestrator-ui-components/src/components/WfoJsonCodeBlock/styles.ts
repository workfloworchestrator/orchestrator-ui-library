import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const euiCodeBlockStyle = css({
        marginTop: 10,
        borderRadius: theme.border.radius.medium,
    });

    const euiBasicCodeBlockStyle = css({
        backgroundColor: 'inherit',
        '.euiCodeBlock__pre': {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
        },
        '.euiCodeBlock__controls': {
            backgroundColor: 'inherit',
        },
    });

    return {
        euiCodeBlockStyle,
        euiBasicCodeBlockStyle,
    };
};
