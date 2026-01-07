import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const tableCodeBlockMarginStyle = css({
        margin: theme.size.base,
        marginTop: theme.size.l,
        marginRight: theme.size.l,
    });

    return {
        tableCodeBlockMarginStyle,
    };
};
