import { css } from '@emotion/react';

export const getWfoObjectFieldStyles = () => {
    const wfoObjectFieldStyles = css({
        width: '100%',
        '& > div': {
            width: '100%',
        },
    });
    return {
        wfoObjectFieldStyles
    };
}
