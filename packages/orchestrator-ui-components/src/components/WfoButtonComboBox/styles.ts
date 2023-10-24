import { css } from '@emotion/react';

export const getStyles = () => {
    const comboBoxWidth = '300px';

    const selectableStyle = css({
        width: comboBoxWidth,
    });

    return {
        selectableStyle,
    };
};
