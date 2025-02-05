import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getPageTemplateStyles = ({ theme }: WfoTheme) => {
    const getSidebarStyle = (navigationHeight: number) =>
        css({
            backgroundColor: theme.colors.body,
            overflowY: 'auto',
            maxHeight: `calc(100vh - ${navigationHeight}px)`,
        });

    const getContentStyle = (navigationHeight: number) =>
        css({
            backgroundColor: theme.colors.emptyShade,
            overflowY: 'auto',
            maxHeight: `calc(100vh - ${navigationHeight}px)`,
        });

    return {
        getSidebarStyle,
        getContentStyle,
    };
};
