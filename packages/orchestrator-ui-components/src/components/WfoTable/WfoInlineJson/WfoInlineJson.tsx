import React, { FC } from 'react';

export type WfoInlineJsonProps = {
    data: object | null;
};

export const WfoInlineJson: FC<WfoInlineJsonProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const valueAsJson = JSON.stringify(data);
    return <span title={valueAsJson}>{valueAsJson}</span>;
};
