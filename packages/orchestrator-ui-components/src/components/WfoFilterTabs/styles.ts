import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const tabStyle = css({
        gap: `${theme.size.xxs}`,
        '.euiTab__prepend': {
            marginRight: `${theme.size.xs}`,
        },
    });

    return { tabStyle };
};
