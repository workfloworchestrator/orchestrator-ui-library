import { css } from '@emotion/react';

export const getStyles = () => {
    const comboBoxWidth = '300px';

    const popoverStyle = css({
        inlineSize: '100%',
        div: { inlineSize: '100%' },
    });

    const selectableStyle = css({
        width: comboBoxWidth,
    });

    return {
        popoverStyle,
        selectableStyle,
    };
};
