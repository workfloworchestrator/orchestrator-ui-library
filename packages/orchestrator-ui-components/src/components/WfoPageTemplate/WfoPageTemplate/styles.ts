import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getPageTemplateStyles = ({
    theme,
    multiplyByBaseUnit,
}: WfoThemeHelpers) => {
    const NAVIGATION_HEIGHT = multiplyByBaseUnit(3);

    const getSidebarStyle = (navigationHeight: number) =>
        css({
            backgroundColor: theme.colors.backgroundBaseSubdued,
            overflowY: 'auto',
            maxHeight: `calc(100vh - ${navigationHeight}px)`,
        });

    const getContentStyle = (navigationHeight: number) =>
        css({
            backgroundColor: theme.colors.backgroundBaseNeutral,
            overflowY: 'auto',
            maxHeight: `calc(100vh - ${navigationHeight}px)`,
        });

    return {
        NAVIGATION_HEIGHT,
        getSidebarStyle,
        getContentStyle,
    };
};
