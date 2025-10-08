import { tint } from '@elastic/eui';
import { css } from '@emotion/react';

import { TABLE_ROW_HEIGHT } from '@/components';
import { WfoTheme } from '@/hooks';

export const getWfoStatusColorFieldStyles = ({ theme }: WfoTheme) => {
    const toStatusColorFieldColor = (color: string) => tint(color, 0.3);

    const getStatusColorFieldStyle = (color: string) =>
        css({
            backgroundColor: toStatusColorFieldColor(color),
            height: TABLE_ROW_HEIGHT,
            width: theme.size.xs,
        });

    return {
        getStatusColorFieldStyle,
    };
};
