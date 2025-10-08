import React, { FC, ReactElement } from 'react';

export type WfoMultilineCellProps = {
    children?: ReactElement | string | null;
};

export const WfoMultilineCell: FC<WfoMultilineCellProps> = ({ children }) => {
    if (!children) {
        return null;
    }

    return <p css={{ textWrap: 'wrap' }}>{children}</p>;
};
